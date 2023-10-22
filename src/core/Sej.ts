import { ViewportControls } from '../controls/types';
import { Editor } from '../editor/types';
import { Renderer } from '../renderer/types';
import { Viewport } from '../viewport/types';
import type { Sej } from './types';

export type SejParams = Sej;

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
export class SejEngine implements Sej {
    container: HTMLDivElement;

    editor: Editor;

    viewport: Viewport;

    renderer: Renderer;

    controls: ViewportControls;

    constructor({ container, editor, viewport, renderer, controls }: SejParams) {
        this.container = container;
        this.editor = editor;
        this.viewport = viewport;
        this.renderer = renderer;
        this.controls = controls;
    }
}
