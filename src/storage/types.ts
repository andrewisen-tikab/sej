/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Storage  class for {@link Editor}.
 */
export type Storage = {
    /**
     * Whether debugging is enabled.
     * @default false
     */
    debug: boolean;
    /**
     * Version of the storage.
     * @default 1
     */
    version: number;
    /**
     * LocalForage instance for the storage.
     */
    store: LocalForage;
    /**
     * Key for the storage.
     * @default 'state'
     */
    key: string;
    /**
     * Retrieves data from the storage and optionally executes a callback with the retrieved data.
     *
     * @param callback - An optional callback function that will be called with the retrieved data.
     *
     * @remarks
     * This method measures the time taken to load the state from IndexedDB and logs it if debugging is enabled.
     */
    get: (callback?: (data: unknown) => void) => void;
    /**
     * Retrieves an item from the storage asynchronously.
     *
     * @returns {Promise<T | null>} A promise that resolves to the item retrieved from the storage, or null if the item does not exist.
     */
    getAsync: () => Promise<unknown | null>;
    /**
     * Stores the provided data in IndexedDB and optionally executes a callback function.
     *
     * @param data - The data to be stored.
     * @param callback - An optional callback function to be executed after the data is stored.
     */
    set: (data: any, callback?: () => void) => void;
    /**
     * Asynchronously sets the provided data in the storage.
     *
     * @template T - The type of data to be stored.
     * @param {T} data - The data to be stored.
     * @returns {Promise<void>} A promise that resolves when the data has been stored.
     *
     * @remarks
     * This method measures the time taken to store the data and logs it to the console if debugging is enabled.
     */
    setAsync: (data: any) => Promise<void>;
    /**
     * Clears all items from the storage.
     *
     * This method removes all key-value pairs from the storage,
     * effectively resetting it to an empty state.
     */
    clear: () => void;
};
