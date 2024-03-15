import * as THREE from 'three';

import type { Test } from '../core/types';

/**
 * The `renderer` is class that handles the rendering of the scene.
 * This is a low-level class that features the actual rendering logic.
 *
 * Write your own render method to change the look and feel of the scene.
 */
export type Renderer = {
    /**
     * If true, the renderer will not render any new frames.
     * @default false
     */
    freeze: boolean;
    /**
     * A [canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) where the renderer draws its output.
     */
    domElement: HTMLCanvasElement;
    /**
     * Set the camera to be used by this renderer.
     * @param camera New camera to be used.
     */
    setCamera(camera: THREE.Camera): void;
    /**
     * Render a single frame.
     * Use this inside the `requestAnimationFrame`.
     */
    render(): void;
    /**
     * Frees the GPU-related resources allocated by this instance.
     * Call this method whenever this instance is no longer used in your app.
     */
    dispose(): void;

    /**
     * Resizes the output canvas to (width, height), and also sets the viewport to fit that size, starting in (0, 0).
     */
    setSize(width: number, height: number, updateStyle?: boolean): void;
} & Test;
