import * as localforage from 'localforage';

import type { Storage } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StorageData = any;

/**
 * AbstractStorage is a generic class that provides an interface for storing and retrieving data
 * using IndexedDB through the localForage library. It includes methods for synchronous and
 * asynchronous data retrieval and storage, as well as a method for clearing the storage.
 *
 * @template T - The type of data to be stored and retrieved. Defaults to `any`.
 */
export class AbstractStorage<T = StorageData> implements Storage {
    debug = false;

    version: number = 1;

    store: LocalForage;

    key: string = 'state';

    /**
     * Initializes a new instance of the Storage class.
     *
     * This constructor checks if IndexedDB is supported in the current environment.
     * If not, it throws an error. If supported, it creates a localforage instance
     * with the specified configuration for the SEJ Editor.
     *
     * @throws {Error} If IndexedDB is not supported.
     */
    constructor() {
        if (window.indexedDB == null) throw new Error('IndexedDB not supported');

        this.store = localforage.createInstance({
            name: 'sej-editor',
            storeName: 'sej_',
            description: 'Storage for the SEJ Editor',
            version: this.version,
            driver: localforage.INDEXEDDB,
        });
    }

    public get(callback?: (data: T) => void): void {
        const start = performance.now();

        this.store.getItem(this.key).then((data) => {
            // eslint-disable-next-line no-console
            if (this.debug) {
                // eslint-disable-next-line no-console
                console.log(
                    `Loaded state from IndexedDB. ${(performance.now() - start).toFixed(2)}ms`,
                );
            }

            callback?.(data as T);
        });
    }

    public getAsync(): Promise<T | null> {
        const start = performance.now();
        const promise = this.store.getItem<T>(this.key);

        if (this.debug) {
            // eslint-disable-next-line no-console
            console.log(`Loaded state from IndexedDB. ${(performance.now() - start).toFixed(2)}ms`);
        }

        return promise;
    }

    /**
     * Stores the provided data in IndexedDB and optionally executes a callback function.
     *
     * @param data - The data to be stored.
     * @param callback - An optional callback function to be executed after the data is stored.
     */
    public set(data: T, callback?: () => void) {
        const start = performance.now();

        this.store.setItem(this.key, data).then(() => {
            // eslint-disable-next-line no-console
            if (this.debug) {
                // eslint-disable-next-line no-console
                console.log(
                    `Saved state to IndexedDB. ${(performance.now() - start).toFixed(2)}ms`,
                );
            }
            callback?.();
        });
    }

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
    async setAsync(data: T): Promise<void> {
        const start = performance.now();

        await this.store.setItem(this.key, data);

        // eslint-disable-next-line no-console
        if (this.debug) {
            // eslint-disable-next-line no-console
            console.log(`Saved state to IndexedDB. ${(performance.now() - start).toFixed(2)}ms`);
        }
    }

    public clear(): void {
        this.store.clear();
    }
}
