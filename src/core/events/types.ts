export const SejEventKeys = {
    /**
     * Runs when Sej is initialized.
     */
    init: 'init',
} as const;

export type SejEventsBase = {
    [SejEventKeys.init]: { type: typeof SejEventKeys.init; data?: undefined };
};

export interface SejEvents extends SejEventsBase {}
