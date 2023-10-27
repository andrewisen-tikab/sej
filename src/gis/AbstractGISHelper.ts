import proj4 from 'proj4';

import { GISHelper, NamedProjections } from './types';

/**
 * Abstract class for all GIS helpers.
 */
export class AbstractGISHelper implements GISHelper {
    enabled: boolean;

    namedProjections: NamedProjections[];

    proj4: typeof proj4;

    constructor() {
        this.enabled = true;
        this.namedProjections = [];
        this.proj4 = proj4;
    }

    addNamedProjection(namedProjection: NamedProjections): void {
        this.namedProjections.push(namedProjection);
        this._update();
    }

    clear() {
        this.namedProjections = [];
        this._update();
    }

    /**
     * E.g.
     * ```ts
     * [
     *  ['EPSG:4326', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
     *  ['EPSG:4269', '+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees'],
     * ]
     * ```
     */
    protected _update() {
        this.proj4.defs(
            this.namedProjections.map((namedProjection) => [
                namedProjection.key,
                namedProjection.projection,
            ]),
        );
    }
}
