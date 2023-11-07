import * as THREE from 'three';

import { ViewportCameraControls } from '../controls/ViewportCameraControls';
import { AbstractDebugger } from '../debugger/AbstractDebugger';
import { AbstractEditor } from '../editor/AbstractEditor';
import { NordicGISHelper } from '../gis/NordicGISHelper';
import { ModelLoader } from '../loader/ModelLoader';
import { WebGLRenderer } from '../renderer/WebGLRenderer';
import { AbstractSpatialHashGrid } from '../spatial/AbstractSpatialHashGrid';
import { AbstractViewport } from '../viewport/AbstractViewport';
import { AbstractExampleFactory } from './AbstractExampleFactory';
import type { ExampleFactorParams } from './types';

/**
 * Abstract example factory.
 */
export class ComplexExampleFactory<
    T extends ExampleFactorParams,
> extends AbstractExampleFactory<T> {
    // test1<S extends ExampleFactorParams>(params: S) {
    //     const foo: InstanceType<S['KeyboardControls']> = new params.KeyboardControls();
    //     return foo as InstanceType<S['KeyboardControls']>;
    // }

    /**
     *
     * @returns Walla
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public build() {
        const { KeyboardControls } = this._params;

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
        const viewportControls = new ViewportCameraControls(
            camera as THREE.PerspectiveCamera,
            renderer.domElement,
        );

        const keyboardControls = new KeyboardControls(
            camera as THREE.PerspectiveCamera,
            renderer.domElement,
        ) as InstanceType<T['KeyboardControls']>;

        // const keyboardControls = createInstance(
        //     KeyboardControl,
        //     camera as THREE.PerspectiveCamera,
        //     renderer.domElement,
        // );

        const viewport = new AbstractViewport({
            editor,
            renderer,
            viewportControls,
            keyboardControls,
        });

        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
        const _debugger = new AbstractDebugger({
            domElement: container,
            renderer,
            controls: viewportControls,
            editor,
        });
        editor.debugger = _debugger;

        const spatialHashGrid = new AbstractSpatialHashGrid();
        scene.add(spatialHashGrid);

        const sejEngine = {
            container,
            editor,
            viewport,
            renderer,
            viewportControls,
            keyboardControls,
            spatialHashGrid,
        };

        const GISHelper = new NordicGISHelper();
        // GISHelper.dev(scene);
        editor.gisHelper = GISHelper;

        viewportControls.setBoundary(spatialHashGrid.getBox());
        const spatialHashGridFolder = _debugger.gui.addFolder('Spatial Hash Grid');
        spatialHashGrid.addDebug(spatialHashGridFolder);

        return sejEngine;
    }
}
