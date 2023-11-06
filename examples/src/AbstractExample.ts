import * as THREE from 'three';

import { AddObjectCommand, Sej } from '../../src/Sej';
import glb from '../assets/glb/spartan_armour_mkv_-_halo_reach.glb?url';
import { Example } from './types';

/**
 * This will be the base class for all examples.
 * It will create a `SejEngine` instance and provide some helper methods.
 */
export class AbstractExample<T = Sej> implements Example {
    hasInit: boolean;

    /**
     * Create a new example.
     * @param factory The factory to use to build the `SejEngine` instance.
     */
    constructor(protected sej: T & Sej) {
        this.hasInit = false;
    }

    public init(loadDummyScene: boolean = true, loadDummyModel: boolean = true): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.sej = this.sej;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.example = this;

        // 6. Call the loaders
        if (loadDummyScene) {
            this.addDummyScene();
        }
        if (loadDummyModel) {
            this.loadFileFromUrl(glb, 'spartan_armour_mkv_-_halo_reach.glb');
        }

        const { camera } = this.sej.editor;
        camera.position.set(0, 2, 5);

        this.hasInit = true;
    }

    /**
     * Add a dummy scene to the editor.
     * Override this method to add your own scene.
     */
    public addDummyScene() {
        if (this.sej === null) throw new Error('Did you forget to call `init()`?');

        const { scene, camera } = this.sej.editor;

        scene.background = new THREE.Color(0x263238).convertLinearToSRGB();
        scene.add(camera);

        const light1 = new THREE.AmbientLight();
        camera.add(light1);
        const light2 = new THREE.DirectionalLight();
        light2.position.set(5, 10, 7.5);
        light2.updateMatrix();
        camera.add(light2);

        const gridHelper = new THREE.GridHelper(10, 10, 0xffffff, 0xffffff);
        const gridMaterial = gridHelper.material as THREE.Material;
        gridMaterial.opacity = 0.2;
        gridMaterial.transparent = true;
        gridHelper.updateMatrix();
    }

    /**
     * Load a file from a URL and add it to the editor.
     * @param url The URL of the file to load.
     * @param filename The name of the file to load.
     */
    public loadFileFromUrl(url: string, filename: string): void {
        if (this.sej === null) throw new Error('Did you forget to call `init()`?');
        const { sej } = this;

        fetch(url)
            .then((res) => res.blob())
            .then((blob) => {
                const file = new File([blob], filename);
                sej.editor.loaderManager.loadFile(file);
            })
            // eslint-disable-next-line no-console
            .catch((e) => console.error(e));
    }

    public test(): boolean {
        if (this.sej === null) throw new Error('Did you forget to call `init()`?');

        if (this.hasInit === false) return false;

        const object = new THREE.Object3D();
        const command = new AddObjectCommand(this.sej.editor, object);

        const status = {
            command: command.test(),
            editor: this.sej.editor.test(),
            selector: this.sej.editor.selector.test(),
            viewport: this.sej.viewport.test(),
            renderer: this.sej.renderer.test(),
            controls: this.sej.viewportControls.test(),
        };

        // eslint-disable-next-line no-console
        console.log(status);

        const everythingPassed = Object.values(status).every((value) => value === true);

        return everythingPassed;
    }
}
