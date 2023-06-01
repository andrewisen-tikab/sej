import Sej, { SejEventKeys } from '../src';
import { Up } from '../src/types';

export type ObjectType = 'glb' | 'tileset';

export type Params = {
    url: string;
    type: ObjectType;
    up: Up;
};

const loadingDiv = document.createElement('div');

/**
 * Helper class that builds the example using the {@link Params} object.
 */
export default class ExampleBuilder {
    constructor({ url, type, up }: Params) {
        const container = document.getElementById('app') as HTMLDivElement | null;
        if (container == null) throw new Error('Container not found');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = 'Loading: 0%';
        container.appendChild(loadingDiv);

        Sej.addEventListener(SejEventKeys.init, (e) => {
            console.log('Init done!');
        });

        Sej.addEventListener(SejEventKeys.onStart, (e) => {
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

        Sej.addEventListener(SejEventKeys.onProgress, (e) => {
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

        Sej.addEventListener(SejEventKeys.onLoad, (e) => {
            loadingDiv.remove();
            console.log('Loading complete!');
        });

        Sej.addEventListener(SejEventKeys.objectAdded, (e) => {
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
        });

        Sej.install();
        Sej.init({ container });
        // @ts-ignore
        Sej.state.playAnimation = true;

        switch (type) {
            case 'glb':
                Sej.api.loadModel(url);
                break;
            case 'tileset':
                Sej.api.loadTileset(url);
                break;
            default:
                break;
        }
    }
}
