import Sej, { SejCore } from '..';
import Manager from './manager';
import localForage from 'localforage';
import * as THREE from 'three';

/**
 * Development manager.
 */
export default class DEVManager extends Manager {
    init() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ä':
                    console.log('Saving scene...');
                    localForage.setItem('sej', JSON.stringify(Sej.api.toJSON()));
                    break;
                case 'ö':
                    console.log('Loading scene...');
                    localForage
                        .getItem('sej')
                        .then((value) => {
                            Sej.api.fromJSON(JSON.parse(value as string));
                            console.log('Scene loaded.');
                        })
                        .catch((error: any) => {
                            console.log(error);
                        });
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * Add a debug background to the scene.
     */
    public addDebugBackground(): DEVManager {
        SejCore.getRenderer().setClearColor(new THREE.Color(0x263238).convertLinearToSRGB(), 1);
        return this;
    }
}
