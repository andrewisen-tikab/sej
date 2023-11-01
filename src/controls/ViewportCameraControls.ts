import * as THREE from 'three';

import CameraControls from 'camera-controls';
import GUI from 'lil-gui';

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

    /**
     * Whether the orthographic camera should be limited to 2D or not.
     *
     * If true, the camera will be limited to 2D and only display a view from above - like Google Maps.
     */
    protected _limitOrographicCameraTo2D!: boolean;

    /**
     * Previous polar angle of the camera.
     */
    protected _previousPolarAngle: number | null = null;

    /**
     * Whether the orthographic camera should be limited to 2D or not.
     *
     * If true, the camera will be limited to 2D and only display a view from above - like Google Maps.
     */
    set limitOrographicCameraTo2D(limit: boolean) {
        // Cast camera as THREE.PerspectiveCamera.
        const perspectiveCamera = this.cameraControls.camera as THREE.PerspectiveCamera;

        // Update the internal flag.
        this._limitOrographicCameraTo2D = limit;

        if (perspectiveCamera.isPerspectiveCamera) {
            // Reset to default values.
            this.cameraControls.minPolarAngle = 0;
            this.cameraControls.maxPolarAngle = Math.PI;

            // If possible, restore the previous polar angle.
            if (this._previousPolarAngle) {
                this.cameraControls.rotatePolarTo(this._previousPolarAngle, true);
            }
            // Once done, no need to keep the previous polar angle.
            this._previousPolarAngle = null;
        } else {
            this.cameraControls.minPolarAngle = limit ? 0 : 0;
            this.cameraControls.maxPolarAngle = limit ? 0 : Math.PI;

            // If we are limiting the camera, save the current polar angle and then set it to 0.
            if (limit) {
                this._previousPolarAngle = this.cameraControls.polarAngle;
                this.cameraControls.rotatePolarTo(0, false);
            }
        }
    }

    get limitOrographicCameraTo2D(): boolean {
        return this._limitOrographicCameraTo2D;
    }

    constructor(object: THREE.Object3D, domElement: HTMLCanvasElement) {
        super(object, domElement);
        const camera = object as THREE.PerspectiveCamera;
        this.cameraControls = new CameraControls(camera, domElement);
        this.cameraControls.setPosition(0, 10, 10);
        this.limitOrographicCameraTo2D = true;
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

        this.limitOrographicCameraTo2D = this._limitOrographicCameraTo2D;
    }

    public addDebug(gui: GUI): void {
        gui.add(this, 'limitOrographicCameraTo2D').name('Limit Orthographic Camera to 2D');
    }

    /**
     * Set the boundary box that encloses the target of the camera. box3 is in THREE.Box3
     * @param box3 {@link THREE.Box3}
     */
    public setBoundary(box3?: THREE.Box3) {
        this.cameraControls.setBoundary(box3);
    }
}
