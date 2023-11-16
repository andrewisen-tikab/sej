import * as THREE from 'three';

import { AbstractKeyboardControls } from '../controls/AbstractKeyboardControls';
import { SimpleViewportControls } from '../controls/SimpleViewportControls';
import type { Sej } from '../core/types';
import { AbstractDebugger } from '../debugger/AbstractDebugger';
import { AbstractEditor } from '../editor/AbstractEditor';
import { ModelLoader } from '../loader/ModelLoader';
import { WebGLRenderer } from '../renderer/WebGLRenderer';
import { AbstractViewport } from '../viewport/AbstractViewport';
import { ExampleFactor, ExampleFactorParams } from './types';

/**
 * Abstract example factory.
 */
export class AbstractExampleFactory<T> implements ExampleFactor {
    protected _params: T | undefined;

    protected _defaultParams: ExampleFactorParams;

    constructor(_params?: T) {
        this._params = _params;
        this._defaultParams = {
            KeyboardControls: AbstractKeyboardControls,
            Renderer: WebGLRenderer,
            Editor: AbstractEditor,
            ViewportControls: SimpleViewportControls,
        };
    }

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
    build(): Sej {
        // 1. Begin by creating a container for the viewer.
        const container = document.getElementById('app') as HTMLDivElement | null;
        if (!container) throw new Error('Container not found');

        // 2. Then create the viewer itself
        const editor = new AbstractEditor();
        editor.setScene(new THREE.Scene());

        // 3. Setup loaders
        const loader = new ModelLoader(editor, 'glb', {
            DRACOLoaderDecoderPath: '../../libs/draco/gltf/',
            KTX2LoaderTranscoderPath: '../../libs/basis/',
        });
        editor.loaderManager.loaders[loader.extension] = loader;

        // 4. Determine the renderer
        const { scene, camera } = editor;
        const renderer = new WebGLRenderer(scene, camera);

        const viewportControls = new SimpleViewportControls(camera, renderer.domElement);

        // 5. Finally, create the viewport where the renderer will do its magic
        const viewport = new AbstractViewport({
            editor,
            renderer,
            viewportControls,
        });

        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
        const _debugger = new AbstractDebugger({
            domElement: container,
            renderer,
            controls: viewportControls,
            editor,
        });
        editor.debugger = _debugger;

        const keyboardControls = new AbstractKeyboardControls(
            camera as THREE.PerspectiveCamera,
            renderer.domElement,
        );

        /**
         * Sej Engine.
         *
         * This is the main class of the library.
         * It acts as a container for all the other parts of the library.
         *
         * All the parts of {@link Sej} are required.
         * All parts know about each other, so you can (mostly) access them from any part.
         *
         * Use a factory to create your own `SejEngine` instance.
         * See the `./factory` folder for more information.
         */
        const sejEngine = {
            container,
            editor,
            viewport,
            renderer,
            viewportControls,
            keyboardControls,
        };

        return sejEngine;
    }
}
