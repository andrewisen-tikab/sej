import type { KeyboardControls, ViewportControls } from '../controls/types';
import type { Editor } from '../editor/types';
import type { Renderer } from '../renderer/types';
import type { SpatialHashGrid } from '../spatial/types';
import type { Viewport } from '../viewport/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export type Test = {
    /**
     * E2E test method.
     *
     * This method should return `true` if the test passes, and `false` if it fails.
     * Check the method itself for more information.
     */
    test(): boolean;
};

export type SerializableObject = {
    /**
     * Creates a new instance of this class based on the given JSON.
     * @param args Any
     */
    fromJSON(...args: any[]): any;
    /**
     * Returns a JSON representation of this class.
     */
    toJSON(): any;
};

/**
 * Base type for all parts of the library.
 * Useful if you want to create your own `SejEngine`.
 */
export type Sej = {
    /**
     * The canvas where the renderer draws its output.
     */
    container: HTMLDivElement;
    /**
     * The `Editor` is the meat of the application.
     * It holds the scene, the camera, the signals, the loader manager, the selector, the debugger and the config.
     */
    editor: Editor;
    /**
     * The `viewport` is class that handles the rendering of the scene.
     * It's a high-level abstraction of the {@link Renderer}.
     */
    viewport: Viewport;
    /**
     * The `renderer` is class that handles the rendering of the scene.
     * This is a low-level class that features the actual rendering logic.
     */
    renderer: Renderer;
    /**
     * The `ViewportControls` controls an object in the viewport.
     * It's usually the camera.
     */
    viewportControls: ViewportControls;
    /**
     * The `KeyboardControls` captures keyboard inputs.
     * Any type of logic can be implemented on top of this.
     */
    keyboardControls: KeyboardControls;
    /**
     * Keep track of X, Y and Zs.
     */
    spatialHashGrid: SpatialHashGrid;
};

export type SupportedCameras = 'perspective' | 'orthographic';
