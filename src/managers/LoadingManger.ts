import { SejCore, SejEventKeys } from '..';
import Manager from './manager';
import * as THREE from 'three';

// @ts-ignore
import WebGPU from 'three/addons/capabilities/WebGPU.js';

/**
 * Development manager.
 */
export default class LoadingManager extends Manager {
    /**
     * Add event listeners.
     * @param loadingManager {@link THREE.LoadingManager}
     */
    public initLoadingManger(loadingManager: THREE.LoadingManager): void {
        loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            SejCore.dispatchEvent({
                type: SejEventKeys.onStart,
                data: {
                    url,
                    itemsLoaded,
                    itemsTotal,
                },
            });
        };

        loadingManager.onLoad = () => {
            SejCore.dispatchEvent({
                type: SejEventKeys.onLoad,
            });
        };

        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            SejCore.dispatchEvent({
                type: SejEventKeys.onProgress,
                data: {
                    url,
                    itemsLoaded,
                    itemsTotal,
                },
            });
        };

        loadingManager.onError = (url) => {
            SejCore.dispatchEvent({
                type: SejEventKeys.onError,
                data: {
                    url,
                },
            });
        };
    }
}
