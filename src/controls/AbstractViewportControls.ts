import * as THREE from 'three';

import GUI from 'lil-gui';

import { ViewportControls } from './types';

/**
 * Abstract class for all viewport controls implementations.
 */
export class AbstractViewportControls extends THREE.EventDispatcher implements ViewportControls {
    protected _enabled: boolean;

    set enabled(value: boolean) {
        this._enabled = value;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    object: THREE.Object3D<THREE.Object3DEventMap>;

    domElement: HTMLCanvasElement;

    constructor(object: THREE.Object3D, domElement: HTMLCanvasElement) {
        super();
        this._enabled = true;
        this.object = object;
        this.domElement = domElement;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this, @typescript-eslint/no-explicit-any
    public setCamera(_camera: THREE.Camera): void {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this, @typescript-eslint/no-explicit-any
    public focus(_object: THREE.Object3D, ..._args: any[]) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    public update(_delta: number) {}

    // eslint-disable-next-line @typescript-eslint/no-dupe-class-members, class-methods-use-this
    public dispose(): void {}

    // eslint-disable-next-line class-methods-use-this
    public test(): boolean {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    public addDebug(_gui: GUI): void {}
}
