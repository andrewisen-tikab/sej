import type { ConfigStorage } from './types';

/**
 * Config class for {@link Viewer}
 */
export class Config {
    /**
     * Name of the config
     */
    public name: string;

    /**
     * Storage of the config
     */
    public storage: ConfigStorage;

    /**
     * Create a new config
     */
    constructor() {
        this.name = 'sej-editor';

        this.storage = {
            language: 'en',
            autosave: true,
            'settings/history': false,
            selected: null,
        };

        if (window.localStorage[this.name] === undefined) {
            window.localStorage[this.name] = JSON.stringify(this.storage);
        } else {
            const data = JSON.parse(window.localStorage[this.name]);
            Object.assign(this.storage, data);
        }
    }

    /**
     * Get a key from the config.
     * @param key Key to get
     */
    public getKey(key: keyof ConfigStorage): ConfigStorage[keyof ConfigStorage] {
        return this.storage[key];
    }

    /**
     * Set the value of a key in the config.
     * @param key
     * @param value
     */
    public setKey(
        key: keyof ConfigStorage,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any,
    ): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.storage[key] as any) = value;

        window.localStorage[this.name] = JSON.stringify(this.storage);

        // eslint-disable-next-line no-console
        console.log(
            // eslint-disable-next-line no-useless-escape
            `[${/\d\d\:\d\d\:\d\d/.exec(new Date().toISOString())![0]}]`,
            'Saved config to LocalStorage.',
        );
    }

    /**
     * Dispose the config from the user's LocalStorage.
     */
    public dispose() {
        delete window.localStorage[this.name];
    }
}
