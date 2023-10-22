import type { Test } from '../core/types';

export type Renderer = {
    /**
     * If true, the renderer will not render any new frames.
     * @default false
     */
    freeze: boolean;

    domElement: HTMLCanvasElement;

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
