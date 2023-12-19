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
    container: HTMLDivElement;
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

    constructor({
        container,
        editor,
        viewportControls,
        keyboardControls,
        renderer,
        optimizer,
    }: AbstractViewportParams) {
        this.editor = editor;

        const { camera, scene, signals } = editor;

        this.optimizer = optimizer ?? new Optimizer();

        this.renderer = renderer || new WebGLRenderer(scene, camera);

        this.renderer.setSize(window.innerWidth, window.innerHeight);

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

            const delta = clock.getDelta();
            if (this.renderer.freeze) return;

            this.optimizer.update();
            this.update(delta);
            this.renderer.render();
        };

        animate();

        this.editor.signals.windowResize.add(() => {
            this.resize();
        });

        this.editor.signals.setCamera.add(() => {
            this.resize();
            this.renderer.setCamera(this.editor.camera);
            this.viewportControls.setCamera(this.editor.camera);
        });

        window.addEventListener('resize', () => {
            this.editor.signals.windowResize.dispatch();
        });

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

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // eslint-disable-next-line class-methods-use-this
    protected _resizePerspectiveCamera(perspectiveCamera: THREE.PerspectiveCamera) {
        /* eslint-disable no-param-reassign */
        perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
        /* eslint-enable no-param-reassign */
        perspectiveCamera.updateProjectionMatrix();
    }

    // eslint-disable-next-line class-methods-use-this
    protected _resizeOrthographicCamera(orthographicCamera: THREE.OrthographicCamera) {
        const aspect = window.innerWidth / window.innerHeight;

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
