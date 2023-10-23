import * as THREE from 'three';

import { SimpleViewportControls } from '../controls/SimpleViewportControls';
import { SejEngine } from '../core/Sej';
import type { Sej } from '../core/types';
import { AbstractDebugger } from '../debugger/AbstractDebugger';
import { AbstractEditor } from '../editor/AbstractEditor';
import { ModelLoader } from '../loader/ModelLoader';
import { WebGLRenderer } from '../renderer/WebGLRenderer';
import { AbstractViewport } from '../viewport/AbstractViewport';
import { ExampleFactor } from './types';

/**
 * Abstract example factory.
 */
export class AbstractExampleFactory implements ExampleFactor {
    // eslint-disable-next-line class-methods-use-this
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

        const controls = new SimpleViewportControls(camera, renderer.domElement);

        // 5. Finally, create the viewport where the renderer will do its magic
        const viewport = new AbstractViewport({
            editor,
            renderer,
            controls,
        });

        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
        const _debugger = new AbstractDebugger({
            domElement: container,
            renderer,
            controls,
            editor,
        });
        editor.debugger = _debugger;

        const sej = new SejEngine({
            container,
            editor,
            viewport,
            renderer,
            controls,
        });

        return sej;
    }
}
