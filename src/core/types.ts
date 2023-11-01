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
    container: HTMLDivElement;
    editor: Editor;
    viewport: Viewport;
    renderer: Renderer;
    viewportControls: ViewportControls;
    keyboardControls: KeyboardControls;
    spatialHashGrid: SpatialHashGrid;
};

export type SupportedCameras = 'perspective' | 'orthographic';
