import * as THREE from 'three';

import { AbstractKeyboardControls } from '../controls/AbstractKeyboardControls';
import { SimpleViewportControls } from '../controls/SimpleViewportControls';
import type { KeyboardControls, ViewportControls } from '../controls/types';
import type { Editor } from '../editor/types';
import { Optimizer } from '../optimizer/Optimizer';
import { WebGLRenderer } from '../renderer/WebGLRenderer';
import type { Renderer } from '../renderer/types';
import type { Viewport } from './types';

export type AbstractViewportParams = {
    container: HTMLElement;
    editor: Editor;
    viewportControls?: ViewportControls;
    keyboardControls?: KeyboardControls;
    renderer?: Renderer;
    optimizer?: Optimizer;
};

/**
 * Abstract class for all viewport implementations.
 */
export class AbstractViewport implements Viewport {
    public editor: Editor;

    public renderer: Renderer;

    public viewportControls: ViewportControls;

    public keyboardControls: KeyboardControls;

    public optimizer: Optimizer;

    private _container: HTMLElement;

    private _resizeObserver: ResizeObserver;

    constructor({
        container,
        editor,
        viewportControls,
        keyboardControls,
        renderer,
        optimizer,
    }: AbstractViewportParams) {
        this.editor = editor;
        this._container = container;

        const { camera, scene, signals } = editor;

        this.optimizer = optimizer ?? new Optimizer();

        this.renderer = renderer || new WebGLRenderer(scene, camera);

        container.appendChild(this.renderer.domElement);

        this.viewportControls =
            viewportControls ?? new SimpleViewportControls(camera, this.renderer.domElement);

        this.keyboardControls =
            keyboardControls ?? new AbstractKeyboardControls(camera, this.renderer.domElement);

        this.viewportControls.addEventListener('change', () => {
            signals.cameraChanged.dispatch(camera);
            signals.refreshSidebarObject3D.dispatch(camera);
        });

        signals.objectFocused.add((object) => {
            this.viewportControls.focus(object);
        });

        const clock = new THREE.Clock();

        /**
         * This is the main animation loop.
         */
        const animate = () => {
            requestAnimationFrame(animate);
            this.editor.debugger?.stats.begin();
            const delta = clock.getDelta();
            if (this.renderer.freeze) return;

            this.optimizer.update();
            this.update(delta);
            this.renderer.render();
            this.editor.debugger?.stats.end();
        };

        animate();

        this.editor.signals.windowResize.add(() => {
            this.resize();
        });

        this.editor.signals.setCamera.add(() => {
            this.renderer.setCamera(this.editor.camera);
            this.viewportControls.setCamera(this.editor.camera);
            this.resize();
        });

        window.addEventListener('resize', () => {
            this.editor.signals.windowResize.dispatch();
        });

        this._resizeObserver = new ResizeObserver(this.resize.bind(this));
        this._resizeObserver.observe(this._container);

        this.resize();
    }

    public update(delta: number) {
        this.viewportControls.update(delta);
        this.keyboardControls.update(delta);
        this.editor.debugger?.update(delta);
    }

    public resize() {
        const perspectiveCamera = this.editor.camera as THREE.PerspectiveCamera;
        perspectiveCamera.isPerspectiveCamera
            ? this._resizePerspectiveCamera(perspectiveCamera)
            : this._resizeOrthographicCamera(this.editor.camera as THREE.OrthographicCamera);

        this.setSize();
    }

    protected setSize() {
        const { clientWidth, clientHeight } = this._container;
        this.renderer.setSize(clientWidth, clientHeight);
    }

    // eslint-disable-next-line class-methods-use-this
    protected _resizePerspectiveCamera(perspectiveCamera: THREE.PerspectiveCamera) {
        const { clientWidth, clientHeight } = this._container;

        /* eslint-disable no-param-reassign */
        perspectiveCamera.aspect = clientWidth / clientHeight;
        /* eslint-enable no-param-reassign */
        perspectiveCamera.updateProjectionMatrix();
    }

    // eslint-disable-next-line class-methods-use-this
    protected _resizeOrthographicCamera(orthographicCamera: THREE.OrthographicCamera) {
        const { clientWidth, clientHeight } = this._container;

        const aspect = clientWidth / clientHeight;

        const halfHeight = orthographicCamera.top;
        const halfWidth = halfHeight * aspect;

        /* eslint-disable no-param-reassign */
        orthographicCamera.left = -halfWidth;
        orthographicCamera.right = halfWidth;
        orthographicCamera.top = halfHeight;
        orthographicCamera.bottom = -halfHeight;
        /* eslint-enable no-param-reassign */

        orthographicCamera.updateProjectionMatrix();
    }

    test() {
        this.resize();
        return true;
    }
}
