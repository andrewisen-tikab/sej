/* eslint-disable class-methods-use-this */
import { LoadingManager } from 'three';

import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

import { AddObjectCommand } from '../commands/AddObjectCommand';
import { Editor } from '../editor/types';
import { AbstractLoader } from './AbstractLoader';
import { File, Loader } from './types';

type Params = {
    DRACOLoaderDecoderPath: string;
    KTX2LoaderTranscoderPath: string;
};

/**
 * Model loader.
 */
export class ModelLoader extends AbstractLoader implements Loader {
    loader: GLTFLoader;

    dracoLoader: DRACOLoader;

    ktx2Loader: KTX2Loader;

    constructor(editor: Editor, extension: string, params: Params) {
        super(editor, extension);

        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath(params.DRACOLoaderDecoderPath);

        this.ktx2Loader = new KTX2Loader();
        this.ktx2Loader.setTranscoderPath(params.KTX2LoaderTranscoderPath);

        this.loader = new GLTFLoader();
        this.loader.setDRACOLoader(this.dracoLoader);
        this.loader.setKTX2Loader(this.ktx2Loader);
        this.loader.setMeshoptDecoder(MeshoptDecoder);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    load(reader: FileReader, file: File, filename: string, _manager: LoadingManager): void {
        reader.addEventListener(
            'load',
            async (event: ProgressEvent<FileReader>) => {
                if (event.target === null) throw new Error('Event target is null');

                const contents = event.target.result;

                if (contents === null) throw new Error('Contents is null');

                this.loader.parse(
                    contents,
                    '',
                    (result) => {
                        const { scene } = result;
                        scene.name = filename;

                        scene.animations.push(...result.animations);
                        this.editor.execute(new AddObjectCommand(this.editor, scene));
                    },
                    (error) => {
                        // eslint-disable-next-line no-console
                        console.log('error', error);
                    },
                );
            },
            false,
        );

        reader.readAsArrayBuffer(file);
    }
}
