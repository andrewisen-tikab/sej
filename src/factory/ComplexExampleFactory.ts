import * as THREE from 'three';

import { ViewportCameraControls } from '../controls/ViewportCameraControls';
import { AbstractDebugger } from '../debugger/AbstractDebugger';
import { NordicGISHelper } from '../gis/NordicGISHelper';
import { ModelLoader } from '../loader/ModelLoader';
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

        // Override the default params.
        const defaultParams = {
            ...this._defaultParams,
            ViewportControls: ViewportCameraControls,
        } satisfies ExampleFactorParams;

        // These are the classes that will be used to create the instances:
        const Renderer = params.Renderer ?? defaultParams.Renderer;
        const KeyboardControls = params.KeyboardControls ?? defaultParams.KeyboardControls;
        const Editor = params.Editor ?? defaultParams.Editor;
        const ViewportControls = params.ViewportControls ?? defaultParams.ViewportControls;
        const Viewport = params.Viewport ?? defaultParams.Viewport;

        const container =
            params.container ?? (document.getElementById('app') as HTMLElement | null);
        if (!container) throw new Error('Container not found');

        // Type the editor as the default editor and the editor passed in the params.
        const editor = new Editor() as InstanceType<typeof defaultParams.Editor> &
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

        const viewportControls = new ViewportControls(
            camera as THREE.PerspectiveCamera,
            renderer.domElement,
        ) as InstanceType<typeof defaultParams.ViewportControls> &
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            InstanceType<T['ViewportControls']>;

        const keyboardControls = new KeyboardControls(
            camera as THREE.PerspectiveCamera,
            renderer.domElement,
        ) as InstanceType<typeof defaultParams.KeyboardControls> &
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            InstanceType<T['KeyboardControls']>;

        const viewport = new Viewport({
            container,
            editor,
            renderer,
            viewportControls,
            keyboardControls,
        }) as InstanceType<typeof defaultParams.Viewport> &
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            InstanceType<T['Viewport']>;

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
        GISHelper.dev(scene);
        editor.gisHelper = GISHelper;

        viewportControls.setBoundary(spatialHashGrid.getBox());
        const spatialHashGridFolder = _debugger.gui.addFolder('Spatial Hash Grid');
        spatialHashGrid.addDebug(spatialHashGridFolder);

        return sejEngine;
    }
}
