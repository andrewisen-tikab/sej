import type { AbstractKeyboardControls } from '../controls/AbstractKeyboardControls';
import type { Sej } from '../core/types';

export type ExampleFactorParams = {
    keyboardControls: typeof AbstractKeyboardControls;
};

/**
 * An example factor.
 *
 * Helps you create your own `SejEngine` instance.
 */
export type ExampleFactor = {
    build(params: Partial<ExampleFactorParams>): Sej;
};
