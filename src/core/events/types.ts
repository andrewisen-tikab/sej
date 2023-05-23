export const SejEventKeys = {
    /**
     * Runs when Sej is initialized.
     */
    init: 'init',
    onStart: 'onStart',
    onLoad: 'onLoad',
    onProgress: 'onProgress',
    onError: 'onError',
} as const;

export type Loading = {
    url: string;
    itemsLoaded: number;
    itemsTotal: number;
};
export type SejEventsBase = {
    [SejEventKeys.init]: { type: typeof SejEventKeys.init; data?: undefined };
    [SejEventKeys.onStart]: { type: typeof SejEventKeys.onStart; data: Loading };
    [SejEventKeys.onLoad]: { type: typeof SejEventKeys.onLoad; data?: undefined };
    [SejEventKeys.onProgress]: { type: typeof SejEventKeys.onProgress; data: Loading };
    [SejEventKeys.onError]: { type: typeof SejEventKeys.onError; data: { url: string } };
};

export interface SejEvents extends SejEventsBase {}
