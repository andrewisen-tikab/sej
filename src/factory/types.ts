import type { AbstractKeyboardControls } from '../controls/AbstractKeyboardControls';

/**
 * Parameters for the `ExampleFactor`.
 */
export type ExampleFactorParams = {
    KeyboardControls: typeof AbstractKeyboardControls;
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
