import { SejCore } from '.';
import { AddObjectCommandParams } from './core/commands/AddObjectCommand';
import ControlsManager from './managers/ControlsManager';
import DEVManager from './managers/DEVManager';
import LoadingManager from './managers/LoadingManger';
import OrientationManager from './managers/OrientationManager';
import { InitProps } from './types';

/**
 * Sej[ˈsɛj] Engine as singleton.
 * Use this instance as a starting off point.
 * Extend the functionality by adding your own managers.
 */
export default class SejEngine {
    /*
     * {@link SejEngine} singleton
     */
    private static _instance: SejEngine;

    /**
     * Generate {@link SejEngine} singleton
     */
    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public readonly managers = {
        dev: new DEVManager(),
        orientation: new OrientationManager(),
        loading: new LoadingManager(),
        controls: new ControlsManager(),
    };

    /**
     * Reference to the {@link SejCore} API.
     */
    public api = SejCore.api;

    /**
     * Reference to the {@link SejCore}.
     */
    public core = SejCore;

    /**
     * Install dependencies and setup `three`.
     * @returns Returns {@link SejEngine} singleton
     */
    public install(): SejEngine {
        SejCore.install();
        return this;
    }

    /**
     * Initialize {@link SejEngine}.
     */
    public init(props: InitProps) {
        SejCore.init(props);

        Object.values(this.managers).forEach((value) => {
            value.init();
        });
        this.managers.loading.initLoadingManger(SejCore.getLoaders().loadingManager);
        return this;
    }

    /**
     *
     * @param url
     * @param params
     */
    public loadTileset(url: string, params?: AddObjectCommandParams): void {
        SejCore.api.loadTileset(url, params);
        const { tilesRenderer } = SejCore.getLoaders();
        if (tilesRenderer[0]?.manager)
            this.managers.loading.initLoadingManger(tilesRenderer[0].manager);
    }
}
