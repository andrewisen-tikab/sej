/**
 * Example type.
 */
export type Example = {
    /**
     * Check if the example has been initialized.
     */
    hasInit: boolean;
    /**
     * Initialize the example.
     * Must be called manually in each example.
     */
    init(): void;
};
