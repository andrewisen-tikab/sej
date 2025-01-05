/* eslint-disable class-methods-use-this */
import * as THREE from 'three';

import GUI from 'lil-gui';
import ThreeSpatialHashGrid from 'three-spatial-hash-grid/src';
import type { Bounds } from 'three-spatial-hash-grid/src/types';

import { MathOperation, SpatialHashGrid } from './types';

const cellSize = 1;
const zero = new THREE.Vector3();

/**
 * Represents an abstract spatial hash grid that extends THREE.Object3D and implements the SpatialHashGrid interface.
 * This class is used to manage a spatial hash grid for efficient spatial queries and updates.
 *
 * @remarks
 * This class uses THREE.js for 3D object management and visualization.
 *
 * @example
 * ```typescript
 * const spatialHashGrid = new AbstractSpatialHashGrid();
 * spatialHashGrid.boundX = 20;
 * spatialHashGrid.boundY = 20;
 * spatialHashGrid.boundZ = 20;
 * spatialHashGrid.update();
 * ```
 *
 */
export class AbstractSpatialHashGrid extends THREE.Object3D implements SpatialHashGrid {
    /**
     * Determines if the current object is a spatial hash grid.
     */
    public isSpatialHashGrid: boolean;

    /**
     * The spatial hash grid used for spatial partitioning.
     */
    public spatialHashGrid: ThreeSpatialHashGrid | null = null;

    /**
     * The bound in the x-axis.
     */
    public boundX: number;

    /**
     * The bound in the y-axis.
     */
    public boundY: number;

    /**
     * The bound in the z-axis.
     */
    public boundZ: number;

    /**
     * The group that contains the box.
     */
    protected _boxGroup: THREE.Group;

    /**
     * The group that contains the hash grid.
     */
    protected _hashGridGroup: THREE.Group;

    /**
     * The bounds of the spatial hash grid.
     */
    protected _bounds: Bounds | null = null;

    /**
     * The box that represents the bounds of the spatial hash grid.
     */
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

    /**
     * Returns the coordinates of the cell near the given (x, y) position.
     *
     * @param x - The x-coordinate of the position.
     * @param y - The y-coordinate of the position.
     * @param mathOperation - The mathematical operation to use for rounding the coordinates. Defaults to 'round'.
     * @returns A tuple containing the x and y coordinates of the nearest cell.
     */
    public getCellNear(
        x: number,
        y: number,
        mathOperation: MathOperation = 'round',
    ): [number, number] {
        const nearX = Math[mathOperation](x / cellSize) * cellSize;
        const nearY = Math[mathOperation](y / cellSize) * cellSize;
        return [nearX, nearY];
    }

    /**
     * Updates the spatial hash grid by first updating the bounding box
     * and then updating the hash grid itself.
     *
     * This method should be called whenever the spatial data changes
     * to ensure the hash grid remains accurate.
     */
    update() {
        this._updateBox();
        this._updateHashGrid();
        return this;
    }

    /**
     * Updates the bounding box and its visual representation.
     *
     * This method clears the current box group, adds an axes helper for reference,
     * and then creates and positions a new bounding box based on the current bounds.
     * Finally, it adds a visual helper for the bounding box to the box group.
     *
     * @protected
     */
    protected _updateBox(): void {
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

    /**
     * Updates the spatial hash grid by clearing the current grid group,
     * recalculating the bounds, and creating a new spatial hash grid.
     *
     * @protected
     * @remarks
     * This method recalculates the bounds based on the current `boundX` and `boundZ` values,
     * and then creates a new instance of `ThreeSpatialHashGrid` with the updated bounds and divisions.
     * The new spatial hash grid is then added to the `_hashGridGroup`.
     */
    protected _updateHashGrid(): void {
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

    /**
     * Retrieves the bounding box of the spatial hash grid.
     *
     * @returns The bounding box of the spatial hash grid.
     */
    public getBox() {
        return this._box;
    }

    /**
     * Adds debug controls to the provided GUI for adjusting the spatial hash grid bounds.
     *
     * @param gui - The GUI instance to which the debug controls will be added.
     *
     * The following controls are added:
     * - Bound X: A slider to adjust the `boundX` property, ranging from 1 to 100.
     * - Bound Y: A slider to adjust the `boundY` property, ranging from 1 to 100.
     * - Bound Z: A slider to adjust the `boundZ` property, ranging from 1 to 100.
     *
     * Each control updates the corresponding property and calls the `update` method when changed.
     */
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
