export const SejEventKeys = {
    /**
     * Runs when Sej is initialized.
     */
    init: 'init',
    onStart: 'onStart',
    onLoad: 'onLoad',
    onProgress: 'onProgress',
    onError: 'onError',
    objectAdded: 'objectAdded',
    objectChanged: 'objectChanged',
    objectRemoved: 'objectRemoved',
    materialAdded: 'materialAdded',
    select: 'select',
    deselect: 'deselect',
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
    [SejEventKeys.objectAdded]: {
        type: typeof SejEventKeys.objectAdded;
        data: { object: THREE.Object3D | null };
    };
    [SejEventKeys.objectChanged]: {
        type: typeof SejEventKeys.objectChanged;
        data: { object: THREE.Object3D };
    };
    [SejEventKeys.objectRemoved]: {
        type: typeof SejEventKeys.objectRemoved;
        data: { object: THREE.Object3D };
    };
    [SejEventKeys.materialAdded]: { type: typeof SejEventKeys.materialAdded; data?: undefined };
    [SejEventKeys.select]: {
        type: typeof SejEventKeys.select;
        data: { object: THREE.Object3D | null };
    };
    [SejEventKeys.deselect]: {
        type: typeof SejEventKeys.deselect;
        data?: undefined;
    };
};

export interface SejEvents extends SejEventsBase {}
