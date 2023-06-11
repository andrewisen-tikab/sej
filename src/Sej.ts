import SejCore from './core';
import { AddObjectCommandParams } from './core/commands/AddObjectCommand';
import DEVManager from './managers/DEVManager';
import LoadingManager from './managers/LoadingManger';
import OrientationManager from './managers/OrientationManager';
import { InitProps } from './types';

/**
 * Sej[ˈsɛj] Engine as singleton.
 * Use this instance as a starting off point.
 * Extend the functionality by adding your own managers.
 */
export default class SejEngine extends SejCore {
    /**
     * {@link SejEngine} singleton
     */
    private static _instance: SejEngine;

    /**
     * Generate {@link SejEngine} singleton
     */
    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public managers = {
        dev: new DEVManager(),
        orientation: new OrientationManager(),
        loading: new LoadingManager(),
    };

    public init(props: InitProps) {
        super.init(props);
        Object.values(this.managers).forEach((value) => {
            value.init();
        });
        this.managers.loading.initLoadingManger(this.getLoaders().loadingManager);
        return this;
    }

    public loadTileset(url: string, params?: AddObjectCommandParams): void {
        super.loadTileset(url, params);
        const { tilesRenderer } = this.getLoaders();
        if (tilesRenderer?.manager) this.managers.loading.initLoadingManger(tilesRenderer.manager);
    }
}
