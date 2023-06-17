import { SejEngine, SejEventKeys, Manager } from '../src';
import { AddObjectCommandParams } from '../src/core/commands/AddObjectCommand';
import { Up } from '../src/types';

export type ObjectType = 'glb' | 'tileset' | 'google-tileset';

export type Params = AddObjectCommandParams & {
    url?: string;
    type: ObjectType;
    up: Up;
    api?: string;
    useWebGL?: boolean;
};

const loadingDiv = document.createElement('div');

/**
 * Custom manager example.
 */
class CustomManager extends Manager {
    public init(): void {
        console.log('CustomManager init');
    }
}
/**
 * New managers.
 */
const myMangers = { custom: new CustomManager() } as const;

/**
 * Extends the {@link SejEngine} class to add custom managers.
 */
class _Sej extends SejEngine {
    readonly managers: SejEngine['managers'] & typeof myMangers = {
        ...this.managers,
        ...myMangers,
    };
}

/**
 * Custom Sej Engine object.
 */
const Sej = new _Sej();

/**
 * Helper class that builds the example using the {@link Params} object.
 */
export default class ExampleBuilder {
    /**
     * Reference to the Sej instance.
     */
    public sej = Sej;

    constructor({ url, type, up, useWebGL, ...rest }: Params) {
        const container = document.getElementById('app') as HTMLDivElement | null;
        if (container == null) throw new Error('Container not found');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = 'Loading: 0%';
        container.appendChild(loadingDiv);

        Sej.api.addEventListener(SejEventKeys.init, (e) => {
            console.log('Init done!');
        });

        Sej.api.addEventListener(SejEventKeys.onStart, (e) => {
            const {
                data: { url, itemsLoaded, itemsTotal },
            } = e;
            console.log(
                'Started loading file: ' +
                    url +
                    '.\nLoaded ' +
                    itemsLoaded +
                    ' of ' +
                    itemsTotal +
                    ' files.',
            );
        });

        Sej.api.addEventListener(SejEventKeys.onProgress, (e) => {
            const {
                data: { url, itemsLoaded, itemsTotal },
            } = e;
            console.log(
                'Loading file: ' +
                    url +
                    '.\nLoaded ' +
                    itemsLoaded +
                    ' of ' +
                    itemsTotal +
                    ' files.',
            );

            const percentage = Math.round((itemsLoaded / itemsTotal) * 100);
            if (percentage >= 100) {
                loadingDiv.remove();
                return;
            }
            loadingDiv.innerHTML = `Loading: ${percentage}%`;
        });

        Sej.api.addEventListener(SejEventKeys.onLoad, (e) => {
            loadingDiv.remove();
            console.log('Loading complete!');
        });

        Sej.api.addEventListener(SejEventKeys.objectAdded, (e) => {
            console.log('Object added!');
            const {
                data: { object },
            } = e;

            switch (up) {
                case '+Y':
                    break;
                case '+Z':
                    object.rotation.x = -Math.PI / 2;
                    break;
                case '-Z':
                    object.rotation.x = Math.PI / 2;
                    break;
                default:
                    break;
            }
            object.updateMatrix();

            // @ts-ignore
            if (object.tilesRenderer) loadingDiv.remove();
        });

        // @ts-ignore
        Sej.core.state.playAnimation = true;
        Sej.install().init({ container, useWebGL });
        Sej.managers.orientation.addGridHelper();
        Sej.managers.dev.addDebugBackground();

        if (url) {
            switch (type) {
                case 'glb':
                    Sej.api.loadModel(url, rest);
                    break;
                case 'tileset':
                    Sej.api.loadTileset(url, rest);
                    break;
                case 'google-tileset':
                    const { api } = rest;
                    if (api == null) throw new Error('Google API key not found');

                    Sej.api.loadGoogleTileset(api);
                    loadingDiv.remove();

                    break;
                default:
                    break;
            }
        }
    }
}
