import type { Sej } from '../../src/core/types';

/**
 * Example type.
 */
export type Example = {
    /**
     * Check if the example has been initialized.
     */
    hasInit: boolean;
    /**
     * The `SejEngine` instance.
     */
    sej: Sej | null;
    /**
     * Initialize the example.
     * Must be called manually in each example.
     */
    init(): void;
};
