import * as THREE from 'three';

import CameraControls from 'camera-controls';

import { AbstractViewportControls } from './AbstractViewportControls';
import type { ViewportControls } from './types';

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
        this.cameraControls.setPosition(0, 5, 5);
    }

    public update(delta: number): void {
        this.cameraControls.update(delta);
    }

    public focus(object: THREE.Object3D<THREE.Object3DEventMap>): void {
        this.cameraControls.fitToBox(object, true, {
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 2,
            paddingRight: 2,
        });
    }
}
