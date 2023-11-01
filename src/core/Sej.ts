import type { KeyboardControls, ViewportControls } from '../controls/types';
import type { Editor } from '../editor/types';
import type { Renderer } from '../renderer/types';
import type { SpatialHashGrid } from '../spatial/types';
import type { Viewport } from '../viewport/types';
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

    viewportControls: ViewportControls;

    keyboardControls: KeyboardControls;

    spatialHashGrid: SpatialHashGrid;

    constructor({
        container,
        editor,
        viewport,
        renderer,
        viewportControls,
        keyboardControls,
        spatialHashGrid,
    }: SejParams) {
        this.container = container;
        this.editor = editor;
        this.viewport = viewport;
        this.renderer = renderer;
        this.viewportControls = viewportControls;
        this.keyboardControls = keyboardControls;
        this.spatialHashGrid = spatialHashGrid;
    }
}
