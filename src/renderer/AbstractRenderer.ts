/* eslint-disable @typescript-eslint/no-unused-vars */
import * as THREE from 'three';

import { ErrorObject } from '@andrewisen/error-manager';

import { ErrorManager, Errors } from '../core/ErrorManager';
import type { Renderer } from './types';

/**
 * An abstract renderer.
 */
export class AbstractRenderer implements Renderer {
    domElement: HTMLCanvasElement;

    freeze: boolean;

    protected _scene: THREE.Object3D<THREE.Object3DEventMap>;

    protected _camera: THREE.Camera;

    /**
     * Create a new abstract renderer.
     */
    constructor(scene: THREE.Object3D<THREE.Object3DEventMap>, camera: THREE.Camera) {
        this.freeze = false;

        this.domElement = document.createElement('canvas');

        this._scene = scene;
        this._camera = camera;

        this._checkAsync();
    }

    setCamera(camera: THREE.Camera): void {
        this._camera = camera;
    }

    /**
     * Check if the provided arguments are valid.
     * Assume that they are not!
     */
    protected async _checkAsync() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (this._scene?.isObject3D === false) {
            throw await ErrorManager.error(
                new ErrorObject(
                    Errors.RENDERER_NOT_OBJECT_3D.key,
                    Errors.RENDERER_NOT_OBJECT_3D.message,
                ),
            );
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (this._camera.isCamera === false) {
            throw await ErrorManager.error(
                new ErrorObject(
                    Errors.RENDERER_NOT_OBJECT_3D.key,
                    Errors.RENDERER_NOT_OBJECT_3D.message,
                ),
            );
        }
    }

    public render(): void {}

    // eslint-disable-next-line class-methods-use-this
    public dispose(): void {}

    /**
     * Resizes the output canvas to (width, height), and also sets the viewport to fit that size, starting in (0, 0).
     */
    // eslint-disable-next-line class-methods-use-this
    public setSize(_width: number, _height: number, _updateStyle?: boolean): void {}

    test(): boolean {
        this.render();
        return true;
    }
}
