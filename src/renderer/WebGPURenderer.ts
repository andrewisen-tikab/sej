import * as THREE from 'three/webgpu';
import type { RendererParameters } from 'three/src/renderers/common/Renderer.js';
import type { WebGPUBackendParameters } from 'three/src/renderers/webgpu/WebGPUBackend.js';

import { AbstractRenderer } from './AbstractRenderer';
import type { Renderer } from './types';

export interface WebGPURendererParameters extends RendererParameters, WebGPUBackendParameters {
    forceWebGL?: boolean | undefined;
}

/**
 * The WebGPU renderer displays your beautifully crafted scenes using [WebGPU](https://en.wikipedia.org/wiki/WebGPU).
 */
export class WebGPURenderer extends AbstractRenderer implements Renderer {
    protected declare _scene: THREE.Scene;

    protected _renderer: THREE.WebGPURenderer;

    /**
     * A Canvas where the renderer draws its output.
     * This is automatically created by the renderer in the constructor (if not provided already); you just need to add it to your page.
     * @default document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' )
     */
    public domElement: HTMLCanvasElement;

    /**
     * Create a new WebGPU renderer.
     */
    constructor(
        scene: THREE.Object3D<THREE.Object3DEventMap>,
        camera: THREE.Camera,
        parameters?: WebGPURendererParameters,
    ) {
        super(scene, camera);
        this._renderer = new THREE.WebGPURenderer(parameters);
        this.domElement = this._renderer.domElement;
    }

    public render(): void {
        this._renderer.render(this._scene, this._camera);
    }

    // eslint-disable-next-line class-methods-use-this
    public dispose(): void {
        this._renderer.dispose();
    }

    public setSize(width: number, height: number, updateStyle?: boolean): void {
        this._renderer.setSize(width, height, updateStyle);
    }
}
