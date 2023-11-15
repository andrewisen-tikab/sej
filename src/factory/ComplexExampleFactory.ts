import * as THREE from 'three';

import { ViewportCameraControls } from '../controls/ViewportCameraControls';
import { AbstractDebugger } from '../debugger/AbstractDebugger';
import { NordicGISHelper } from '../gis/NordicGISHelper';
import { ModelLoader } from '../loader/ModelLoader';
import { AbstractViewport } from '../viewport/AbstractViewport';
import { AbstractExampleFactory } from './AbstractExampleFactory';
import { ExampleFactorParams } from './types';

/**
 * Abstract example factory.
 */
export class ComplexExampleFactory<T> extends AbstractExampleFactory<T> {
    /**
     * Build example.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public build() {
        // Setup class constructors and then use InstanceType to create the instance.
        const params = this._params as Partial<ExampleFactorParams> & T;
        const { _defaultParams: defaultParams } = this;

        const Renderer = params.Renderer ?? defaultParams.Renderer;
        const KeyboardControls = params.KeyboardControls ?? defaultParams.KeyboardControls;
        const Editor = params.Editor ?? defaultParams.Editor;

        const container = document.getElementById('app') as HTMLDivElement | null;
        if (!container) throw new Error('Container not found');

        const editor = new Editor() as InstanceType<typeof Editor> &
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            InstanceType<T['Editor']>;

        editor.setScene(new THREE.Scene());

        const loader = new ModelLoader(editor, 'glb', {
            DRACOLoaderDecoderPath: '../../libs/draco/gltf/',
            KTX2LoaderTranscoderPath: '../../libs/basis/',
        });
        editor.loaderManager.loaders[loader.extension] = loader;

        const { scene, camera, spatialHashGrid } = editor;

        // Create a renderer that either from the params or the default renderer.
        const renderer = new Renderer(scene, camera) as InstanceType<typeof Renderer> &
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            InstanceType<T['Renderer']>;

        const viewportControls = new ViewportCameraControls(
            camera as THREE.PerspectiveCamera,
            renderer.domElement,
        );

        const keyboardControls = new KeyboardControls(
            camera as THREE.PerspectiveCamera,
            renderer.domElement,
        ) as InstanceType<typeof KeyboardControls> &
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            InstanceType<T['KeyboardControls']>;

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

        const sejEngine = {
            container,
            editor,
            viewport,
            renderer,
            viewportControls,
            keyboardControls,
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
