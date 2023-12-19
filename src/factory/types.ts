import type { AbstractKeyboardControls } from '../controls/AbstractKeyboardControls';
import type { AbstractViewportControls } from '../controls/AbstractViewportControls';
import type { AbstractEditor } from '../editor/AbstractEditor';
import type { AbstractRenderer } from '../renderer/AbstractRenderer';

/**
 * Parameters for the `ExampleFactor`.
 * THis allows you to customize the `SejEngine` instance by passing in your own classes.
 */
export type ExampleFactorParams = {
    /**
     * Custom keyboard controls.
     * See {@link AbstractKeyboardControls} for more information.
     */
    KeyboardControls: typeof AbstractKeyboardControls;
    /**
     * Custom renderer.
     * See {@link AbstractRenderer} for more information.
     */
    Renderer: typeof AbstractRenderer;
    /**
     * Custom editor.
     * See {@link AbstractEditor} for more information.
     */
    Editor: typeof AbstractEditor;
    /**
     * Custom viewport controls.
     * See {@link AbstractViewportControls} for more information.
     */
    ViewportControls: typeof AbstractViewportControls;
    /**
     * The container where the `SejEngine` instance will be rendered.
     */
    container: HTMLElement | null;
};

/**
 * An example factor.
 *
 * Helps you create your own `SejEngine` instance.
 */
export type ExampleFactor = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    build(params: Partial<ExampleFactorParams>): any;
};
