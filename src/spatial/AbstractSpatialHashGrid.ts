import * as THREE from 'three';

import GUI from 'lil-gui';
import ThreeSpatialHashGrid from 'three-spatial-hash-grid/src';
import type { Bounds } from 'three-spatial-hash-grid/src/types';

import { MathOperation, SpatialHashGrid } from './types';

const cellSize = 1;
const zero = new THREE.Vector3();

/**
 * AbstractSpatialHashGrid is a base class for SpatialHashGrid.
 */
export class AbstractSpatialHashGrid extends THREE.Object3D implements SpatialHashGrid {
    public isSpatialHashGrid: boolean;

    public spatialHashGrid: ThreeSpatialHashGrid | null = null;

    public boundX: number;

    public boundY: number;

    public boundZ: number;

    protected _boxGroup: THREE.Group;

    protected _hashGridGroup: THREE.Group;

    protected _bounds: Bounds | null = null;

    protected _box: THREE.Box3;

    constructor() {
        super();
        this.isSpatialHashGrid = true;
        this._boxGroup = new THREE.Group();
        this._hashGridGroup = new THREE.Group();

        this._box = new THREE.Box3();

        this.boundX = 10;
        this.boundY = 10;
        this.boundZ = 10;

        this.add(this._hashGridGroup);
        this.add(this._boxGroup);
        this.update();
    }

    // eslint-disable-next-line class-methods-use-this
    getCellNear(x: number, y: number, mathOperation: MathOperation = 'round'): [number, number] {
        const nearX = Math[mathOperation](x / cellSize) * cellSize;
        const nearY = Math[mathOperation](y / cellSize) * cellSize;
        return [nearX, nearY];
    }

    update() {
        this._updateBox();
        this._updateHashGrid();
    }

    protected _updateBox() {
        this._boxGroup.clear();

        const axesHelper = new THREE.AxesHelper(5);
        this._boxGroup.add(axesHelper);

        const widthX = this.boundX;
        const heightY = this.boundY;
        const depthZ = this.boundZ;
        this._box.setFromCenterAndSize(zero, new THREE.Vector3(widthX, heightY, depthZ));
        this._box.translate(new THREE.Vector3(widthX / 2, heightY / 2, depthZ / 2));

        const helper = new THREE.Box3Helper(this._box, 0xffff00);
        this._boxGroup.add(helper);
    }

    protected _updateHashGrid() {
        this._hashGridGroup.clear();

        this._bounds = [
            [0, 0],
            [this.boundX, this.boundZ],
        ];

        const gridHelperSize = this._bounds[1][0] - this._bounds[0][0];

        const gridHelperDivisions = gridHelperSize / cellSize;

        this.spatialHashGrid = new ThreeSpatialHashGrid(
            this._bounds,
            [gridHelperDivisions, gridHelperDivisions],
            true,
        );
        this._hashGridGroup.add(this.spatialHashGrid.group);
    }

    public getBox() {
        return this._box;
    }

    public addDebug(gui: GUI): void {
        gui.add(this, 'boundX', 1, 100, 1)
            .name('Bound X')
            .onChange((value: number) => {
                this.boundX = value;
                this.update();
            });
        gui.add(this, 'boundY', 1, 100, 1)
            .name('Bound Y')
            .onChange((value: number) => {
                this.boundY = value;
                this.update();
            });
        gui.add(this, 'boundZ', 1, 100, 1)
            .name('Bound Z')
            .onChange((value: number) => {
                this.boundZ = value;
                this.update();
            });
    }
}
