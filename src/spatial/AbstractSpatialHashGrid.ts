import * as THREE from 'three';

import ThreeSpatialHashGrid from 'three-spatial-hash-grid';
import type { Bounds } from 'three-spatial-hash-grid/src/types';

import { SpatialHashGrid } from './types';

const cellSize = 1;
const zero = new THREE.Vector3();

/**
 * AbstractSpatialHashGrid is a base class for SpatialHashGrid.
 */
export class AbstractSpatialHashGrid extends THREE.Object3D implements SpatialHashGrid {
    public isSpatialHashGrid: boolean;

    public spatialHashGrid: ThreeSpatialHashGrid;

    public boundY: number;

    protected _boxGroup: THREE.Group;

    protected _bounds: Bounds;

    protected _box: THREE.Box3;

    constructor() {
        super();
        this.isSpatialHashGrid = true;
        this._boxGroup = new THREE.Group();

        this._box = new THREE.Box3();

        this.boundY = 10;
        this._bounds = [
            [0, 0],
            [10, 10],
        ];

        const gridHelperSize = this._bounds[1][0] - this._bounds[0][0];

        const gridHelperDivisions = gridHelperSize / cellSize;

        this.spatialHashGrid = new ThreeSpatialHashGrid(
            this._bounds,
            [gridHelperDivisions, gridHelperDivisions],
            true,
        );

        this.add(this.spatialHashGrid.group);
        this.add(this._boxGroup);
        this.update();
    }

    update() {
        this.spatialHashGrid.update();
        this._updateBox();
    }

    protected _updateBox() {
        this._boxGroup.clear();

        const axesHelper = new THREE.AxesHelper(5);
        this._boxGroup.add(axesHelper);

        const widthX = this._bounds[1][0] - this._bounds[0][0];
        const heightY = this.boundY;
        const depthZ = this._bounds[1][1] - this._bounds[0][1];
        this._box.setFromCenterAndSize(zero, new THREE.Vector3(widthX, heightY, depthZ));
        this._box.translate(new THREE.Vector3(widthX / 2, heightY / 2, depthZ / 2));

        const helper = new THREE.Box3Helper(this._box, 0xffff00);
        this._boxGroup.add(helper);
    }

    public getBox() {
        return this._box;
    }
}
