import * as THREE from 'three';

import { AbstractRenderer } from './AbstractRenderer';
import type { Renderer } from './types';

/**
 * The WebGL renderer displays your beautifully crafted scenes using [WebGL](https://en.wikipedia.org/wiki/WebGL).
 */
export class WebGLRenderer extends AbstractRenderer implements Renderer {
    protected _renderer: THREE.WebGLRenderer;

    /**
     * A Canvas where the renderer draws its output.
     * This is automatically created by the renderer in the constructor (if not provided already); you just need to add it to your page.
     * @default document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' )
     */
    public domElement: HTMLCanvasElement;

    /**
     * Create a new WebGL renderer.
     */
    constructor(
        scene: THREE.Object3D<THREE.Object3DEventMap>,
        camera: THREE.Camera,
        parameters?: THREE.WebGLRendererParameters,
    ) {
        super(scene, camera);
        this._renderer = new THREE.WebGLRenderer(parameters);
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
