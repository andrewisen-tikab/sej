import type { AbstractKeyboardControls } from '../controls/AbstractKeyboardControls';
import type { AbstractEditor } from '../editor/AbstractEditor';
import type { AbstractRenderer } from '../renderer/AbstractRenderer';

/**
 * Parameters for the `ExampleFactor`.
 */
export type ExampleFactorParams = {
    KeyboardControls: typeof AbstractKeyboardControls;
    Renderer: typeof AbstractRenderer;
    Editor: typeof AbstractEditor;
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
