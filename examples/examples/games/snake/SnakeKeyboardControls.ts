import * as THREE from 'three';

import { AbstractKeyboardControls } from '../../../../src/controls/AbstractKeyboardControls';
import type { KeyboardControls } from '../../../../src/controls/types';
import type { SpatialHashGrid } from '../../../../src/spatial/types';
import { FuturePositionHelper } from './FuturePositionHelper';
import { Snake3D } from './Snake3D';
import { SnakeFood3D } from './SnakeFood3D';

const snakeBoundingBox = new THREE.Box3();
const snakeFoodBoundingBox = new THREE.Box3();

const position = new THREE.Vector3();
const futurePosition = new THREE.Vector3();

const direction = new THREE.Vector3(0, 0, 1);
const previousDirection = new THREE.Vector3().copy(direction);

/**
 * Abstract class for all keyboard controls implementations.
 */
export class SnakeKeyboardControls extends AbstractKeyboardControls implements KeyboardControls {
    static isSnakeControls = true;

    public iamSnake = true;

    private _group: THREE.Group;

    private _snake: Snake3D;

    private _arrow: THREE.Group;

    private _arrowHelper: THREE.ArrowHelper;

    private _speed: number = 0.05;

    public spatialHashGrid: SpatialHashGrid | null = null;

    private _futurePositionHelper: FuturePositionHelper;

    private _snakeFood: SnakeFood3D;

    constructor(object: THREE.Object3D, domElement: HTMLCanvasElement) {
        super(object, domElement);

        // Main group
        this._group = new THREE.Group();

        // Snake and food
        this._snake = new Snake3D();
        this._snakeFood = new SnakeFood3D();

        // Helpers
        const { width, depth } = this._snake;
        this._arrow = new THREE.Group();
        this._arrowHelper = new THREE.ArrowHelper(
            direction,
            this._snake.position,
            1,
            0xff0000,
            Math.max(width, depth) * 2,
            0.5,
        );
        this._futurePositionHelper = new FuturePositionHelper();
        this._group.add(this._snakeFood);
        this._init();
    }

    protected _init() {
        const { width, depth, height } = this._snake;
        this._snake.position.set(width / 2, 0, depth / 2);
        this._group.add(this._snake);

        this._arrow.visible = false;
        this._arrow.add(this._arrowHelper);
        this._group.add(this._arrow);

        this._arrowHelper.position.set(0, height + 1, 0);

        this._futurePositionHelper.visible = false;
        this._group.add(this._futurePositionHelper);
    }

    init(scene: THREE.Scene, spatialHashGrid: SpatialHashGrid) {
        scene.add(this._group);
        this.spatialHashGrid = spatialHashGrid;
        this._setSnakeFoodPosition();
    }

    /**
     * Write your own onKeyDown function in your implementation.
     * @param event
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onKeyDown(_event: KeyboardEvent) {
        switch (true) {
            case this.keyStates.KeyW:
                direction.set(0, 0, -1);
                break;
            case this.keyStates.KeyS:
                direction.set(0, 0, 1);
                break;
            case this.keyStates.KeyA:
                direction.set(-1, 0, 0);
                break;
            case this.keyStates.KeyD:
                direction.set(1, 0, 0);
                break;
            default:
                break;
        }
        this._adjustPositionToGrid();
        previousDirection.copy(direction);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(_delta: number) {
        position.copy(this._snake.position);
        this._calculatePositions();
        this._checkCollision();
        this._updatePositions();
        this._checkFoodCollision();
    }

    private _checkCollision() {
        if (!this.spatialHashGrid) return;
        const { width, depth } = this._snake;

        const [nearX, nearZ] = this.spatialHashGrid.getCellNear(position.x, position.z);
        if (nearX < 1) {
            position.x = 10 - width / 2;
        } else if (nearX > 10 - 1) {
            position.x = 0 + width / 2;
        }
        if (nearZ < 0 + 1) {
            position.z = 10 - depth / 2;
        } else if (nearZ > 10 - 1) {
            position.z = 0 + depth / 2;
        }
    }

    protected _calculatePositions() {
        position.addScaledVector(direction, this._speed);

        futurePosition.copy(position);
        futurePosition.add(direction.clone().multiplyScalar(this._snake.width / 2));
    }

    protected _updatePositions() {
        this._snake.position.copy(position);
        this._arrow.position.copy(position);
        this._arrowHelper.setDirection(direction);
        this._futurePositionHelper.position.copy(futurePosition);
    }

    private _checkFoodCollision() {
        snakeBoundingBox.setFromObject(this._snake);
        snakeFoodBoundingBox.setFromObject(this._snakeFood);

        // Determine if the two boxes overlap. Returns a Boolean.
        if (snakeBoundingBox.intersectsBox(snakeFoodBoundingBox)) {
            this._setSnakeFoodPosition();
        }
    }

    protected _adjustPositionToGrid() {
        if (!this.spatialHashGrid) return;
        // Check if direction and previousDirection are same
        if (direction.equals(previousDirection)) return;

        const { width, depth } = this._snake;
        const [nearX, nearZ] = this.spatialHashGrid.getCellNear(
            futurePosition.x + width / 2,
            futurePosition.z + depth / 2,
        );
        position.x = nearX - width / 2;
        position.z = nearZ - depth / 2;
        this._updatePositions();
    }

    protected _setSnakeFoodPosition() {
        // Random between 0 and 10
        const randomX = Math.floor(Math.random() * 10);
        const randomY = Math.floor(Math.random() * 10);

        if (!this.spatialHashGrid) return;
        const { width, depth } = this._snakeFood;
        const [nearX, nearZ] = this.spatialHashGrid.getCellNear(randomX, randomY);
        if (nearX === position.x && nearZ === position.z) {
            this._setSnakeFoodPosition();
            return;
        }
        this._snakeFood.position.set(nearX + width / 2, 0, nearZ + depth / 2);
    }
}
