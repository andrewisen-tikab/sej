import * as THREE from 'three';

import type { Test } from '../core/types';

export type ViewportControls = {
    /**
     * Whether the controls are enabled or not.
     * @default true
     */
    enabled: boolean;
    /**
     * Object that is begin controlled.
     * Usually the camera.
     */
    object: THREE.Object3D<THREE.Object3DEventMap>;
    /**
     * Reference to the canvas element where the controls are attached.
     * I.e. where pointer events are listened.
     */
    domElement: HTMLCanvasElement;
    /**
     * Set the camera to be used by this renderer.
     * @param camera New camera to be used.
     */
    setCamera: (camera: THREE.Camera) => void;
    /**
     * Focus the controls on the given target.
     * @param target Target to focus on.
     * @param args Additional arguments.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    focus: (...args: any[]) => void;
    /**
     * Call this on every frame to update the controls.
     * @param delta
     */
    update: (delta: number) => void;
    /**
     * Dispose the controls and its event listeners.
     * @param delta
     */
    dispose: (delta: number) => void;
} & THREE.EventDispatcher &
    Test;
