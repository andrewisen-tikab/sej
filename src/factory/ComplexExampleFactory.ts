import * as THREE from 'three';

import { ViewportCameraControls } from '../controls/ViewportCameraControls';
import { SejEngine } from '../core/Sej';
import type { Sej } from '../core/types';
import { AbstractDebugger } from '../debugger/AbstractDebugger';
import { AbstractEditor } from '../editor/AbstractEditor';
import { NordicGISHelper } from '../gis/NordicGISHelper';
import { ModelLoader } from '../loader/ModelLoader';
import { WebGLRenderer } from '../renderer/WebGLRenderer';
import { AbstractSpatialHashGrid } from '../spatial/AbstractSpatialHashGrid';
import { AbstractViewport } from '../viewport/AbstractViewport';
import { ExampleFactor } from './types';

/**
 * Abstract example factory.
 */
export class ComplexExampleFactory implements ExampleFactor {
    // eslint-disable-next-line class-methods-use-this
    build(): Sej {
        const container = document.getElementById('app') as HTMLDivElement | null;
        if (!container) throw new Error('Container not found');

        const editor = new AbstractEditor();
        editor.setScene(new THREE.Scene());

        const loader = new ModelLoader(editor, 'glb', {
            DRACOLoaderDecoderPath: '../../libs/draco/gltf/',
            KTX2LoaderTranscoderPath: '../../libs/basis/',
        });
        editor.loaderManager.loaders[loader.extension] = loader;

        const { scene, camera } = editor;

        const renderer = new WebGLRenderer(scene, camera);
        const controls = new ViewportCameraControls(
            camera as THREE.PerspectiveCamera,
            renderer.domElement,
        );

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

        const gis = new NordicGISHelper();
        gis.dev(scene);

        const spatial = new AbstractSpatialHashGrid();
        scene.add(spatial);

        controls.setBoundary(spatial.getBox());

        return sej;
    }
}
