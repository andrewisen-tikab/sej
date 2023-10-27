/* eslint-disable @typescript-eslint/naming-convention */

/* eslint-disable class-methods-use-this */
import * as THREE from 'three';

import { AbstractGISHelper } from './AbstractGISHelper';
import type { Coordinate, GISHelper } from './types';
import { lat2tile, lon2tile } from './utils';

// See: https://latlong.mellifica.se/
export type SupportedProjections = 'default' | 'SWEREF991800';

export const dummyWGS84: Coordinate = {
    /**
     * N 59° 19.9545'
     * N 59° 19' 57.27"
     */
    latitude: 59.332575,
    /**
     * E 18° 3.9123'
     * E 18° 3' 54.74"
     */
    longitude: 18.065205,
};

/**
 * RT90 2.5 gon V 0:-15
 */
export const dummyRT90 = {
    x: 6581266.795,
    y: 1628626.992,
};

export const dummySWREF991800 = {
    north: 6579719.092,
    east: 153711.505,
};

// Nymble
export const dummySWREF991800_2 = {
    north: 6581355.065,
    east: 154014.689,
};

// Nymble
export const dummyWGS84_2: Coordinate = {
    latitude: 59.347258,
    longitude: 18.070562,
};

// Constants for OSM tile server
const osmTileServer = 'https://a.tile.openstreetmap.org'; // You can use different subdomains for load balancing
const osmTilePath = '/{z}/{x}/{y}.png'; // Tile path format
const zoomLevel = 19; // 17=1.1943
const tileResolution = 0.5972; // m/pixel
const tilePixelSize = 256; // pixels

/**
 * Function to construct the OSM tile URL
 * @param x
 * @param y
 * @param z
 * @returns
 */
const getOSMTileURL = (x: number, y: number, z: number) =>
    osmTileServer +
    osmTilePath.replace('{z}', `${z}`).replace('{x}', `${x}`).replace('{y}', `${y}`);

/**
 * GIS helper for Nordic countries.
 */
export class NordicGISHelper extends AbstractGISHelper implements GISHelper {
    /**
     * Fallback projection if a projection is not found in `namedProjections`.
     */
    protected _defaultProjection: string;

    protected _origin: THREE.Vector2;

    set defaultProjection(projection: string) {
        this._defaultProjection = projection;
        this._update();
    }

    constructor() {
        super();

        this._origin = new THREE.Vector2();

        this._defaultProjection =
            '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';

        this.addNamedProjection({
            key: 'default',
            projection: this._defaultProjection,
        });

        this.addNamedProjection({
            key: 'SWEREF991800',
            projection:
                '+proj=tmerc +lat_0=0 +lon_0=18.0 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        });
    }

    /**
     * Sample dev code.
     * @param scene Scene for objects to be added to
     * @param projection Projection to use
     * @deprecated WIP
     */
    dev(scene: THREE.Object3D, projection: SupportedProjections = 'SWEREF991800') {
        const { proj4 } = this;

        // Coordinate 1 in SWREF99
        const coord1 = {
            north: 6579719.092,
            east: 153711.505,
        };

        // Coordinate 2 in SWREF99
        const coord2 = {
            north: 6581355.065,
            east: 154014.689,
        };

        // Convert the coordinates to the default projection
        const localCoord1 = proj4(projection, 'default', [coord1.east, coord1.north]);
        const localCoord2 = proj4(projection, 'default', [coord2.east, coord2.north]);

        // Calculate the offset from coord1 to set it as the origin (0,0,0)
        this._origin.set(localCoord1[0] * -1, localCoord1[1] * -1);

        // Translate coord2 to the local coordinate system with coord1 as the origin
        const localCoord2RelativeToOrigin = {
            x: localCoord2[0] + this._origin.x,
            y: localCoord2[1] + this._origin.y,
        };

        // Add dummy plane to verify that the coordinates are correct
        const plane1 = this.generatePlane(dummyWGS84);
        scene.add(plane1);

        // Plane 2 should be at a distance of 1,664.43 m from plane 1
        const plane2 = this.generatePlane(dummyWGS84_2);
        plane2.position.set(localCoord2RelativeToOrigin.x, 0, localCoord2RelativeToOrigin.y);

        //  const distance = plane1.position.distanceTo(plane2.position);
        // 1,664.43 m

        scene.add(plane2);
    }

    /**
     * Generate a plane with a texture from OpenStreetMap
     * @param coordinates WGS84 coordinates
     * @returns Plane
     */
    public generatePlane(coordinates: Coordinate): THREE.Mesh {
        // Get the tile for OpenStreetMap
        const tileX = lon2tile(coordinates.longitude, zoomLevel);
        const tileY = lat2tile(coordinates.latitude, zoomLevel);

        // Calculate the resolution of the tile
        const resolution = Math.abs(
            tileResolution * Math.cos(coordinates.latitude * (Math.PI / 180)),
        );
        // Calculate the size of the tile in meters
        const tileSize = resolution * tilePixelSize;

        // Construct the URL for the tile
        const url = getOSMTileURL(tileX, tileY, zoomLevel);

        // Load the tile as a texture and apply it to a plane
        const texture = new THREE.TextureLoader().load(url);

        const geometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide, // Ensure the texture is visible from both sides
        });

        const plane = new THREE.Mesh(geometry, material);
        plane.rotateX(-Math.PI / 2); // Rotate the plane to make it horizontal

        return plane;
    }
}
