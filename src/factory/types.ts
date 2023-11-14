import type { AbstractKeyboardControls } from '../controls/AbstractKeyboardControls';
import type { WebGLRenderer } from '../renderer/WebGLRenderer';

/**
 * Parameters for the `ExampleFactor`.
 */
export type ExampleFactorParams = {
    KeyboardControls: typeof AbstractKeyboardControls;
    Renderer: typeof WebGLRenderer;
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
