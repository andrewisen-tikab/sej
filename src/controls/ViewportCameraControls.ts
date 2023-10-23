import * as THREE from 'three';

import CameraControls from 'camera-controls';

import { AbstractViewportControls } from './AbstractViewportControls';
import type { ViewportControls } from './types';

const ACTION = {
    NONE: 0,
    ROTATE: 1,
    TRUCK: 2,
    OFFSET: 4,
    DOLLY: 8,
    ZOOM: 16,
    TOUCH_ROTATE: 32,
    TOUCH_TRUCK: 64,
    TOUCH_OFFSET: 128,
    TOUCH_DOLLY: 256,
    TOUCH_ZOOM: 512,
    TOUCH_DOLLY_TRUCK: 1024,
    TOUCH_DOLLY_OFFSET: 2048,
    TOUCH_DOLLY_ROTATE: 4096,
    TOUCH_ZOOM_TRUCK: 8192,
    TOUCH_ZOOM_OFFSET: 16384,
    TOUCH_ZOOM_ROTATE: 32768,
};

CameraControls.install({ THREE });

/**
 * Viewport camera controls.
 */
export class ViewportCameraControls extends AbstractViewportControls implements ViewportControls {
    set enabled(value: boolean) {
        super.enabled = value;
        this.cameraControls.enabled = value;
    }

    /**
     * Reference to the [camera-controls](https://github.com/yomotsu/camera-controls) instance.
     */
    public cameraControls: CameraControls;

    constructor(object: THREE.Object3D, domElement: HTMLCanvasElement) {
        super(object, domElement);
        const camera = object as THREE.PerspectiveCamera;
        this.cameraControls = new CameraControls(camera, domElement);
        this.cameraControls.setPosition(0, 10, 10);
    }

    public update(delta: number): void {
        this.cameraControls.update(delta);
    }

    public focus(object: THREE.Object3D<THREE.Object3DEventMap>): void {
        const padding = 2;
        this.cameraControls.fitToBox(object, true, {
            paddingTop: padding,
            paddingBottom: padding,
            paddingLeft: padding,
            paddingRight: padding,
        });
    }

    public setCamera(camera: THREE.Camera): void {
        this.cameraControls.saveState();
        const perspectiveCamera = camera as THREE.PerspectiveCamera;
        this.cameraControls.camera = perspectiveCamera; // Cast as THREE.PerspectiveCamera to satisfy the library

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.cameraControls.mouseButtons.wheel = perspectiveCamera.isPerspectiveCamera
            ? ACTION.DOLLY
            : ACTION.ZOOM;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.cameraControls.touches.two = perspectiveCamera.isPerspectiveCamera
            ? ACTION.TOUCH_DOLLY_TRUCK
            : ACTION.TOUCH_ZOOM_TRUCK;
    }
}
