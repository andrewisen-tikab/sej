import GameStats from 'gamestats.js';
import GUI from 'lil-gui';
import Stats from 'stats-gl';

import type { ViewportControls } from '../controls/types';
import type { SupportedCameras } from '../core/types';
import type { Editor } from '../editor/types';
import type { Renderer } from '../renderer/types';
import { DebugFolders, type DebugParams, type Debugger, defaultDebugParams } from './types';

export type AbstractDebuggerParams = {
    domElement?: HTMLElement;
    editor: Editor;
    renderer: Renderer;
    controls: ViewportControls;
};

/**
 * Abstract debugger class for all debuggers.
 */
export class AbstractDebugger implements Debugger {
    protected _enabled: boolean;

    protected editor: Editor;

    set enabled(value: boolean) {
        this._enabled = value;
        this.enabled ? this.gui.show() : this.gui.hide();
        this.gameStats.dom.style.display = this.enabled ? 'block' : 'none';
        this.statsGL.dom.style.display = this.enabled ? 'block' : 'none';

        this._previouslyEnabled = this.enabled;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    protected _previouslyEnabled: boolean;

    gui: GUI;

    guiFolders: DebugFolders;

    params: DebugParams;

    gameStats: GameStats;

    statsGL: Stats;

    domElement: HTMLElement;

    renderer: Renderer;

    controls: ViewportControls;

    constructor({
        domElement = document.body,
        renderer,
        controls,
        editor,
    }: AbstractDebuggerParams) {
        this.domElement = domElement;
        this.renderer = renderer;
        this.controls = controls;
        this.editor = editor;

        // Always enable debugger in dev mode
        this._enabled =
            import.meta.env !== undefined ? true : localStorage.getItem('debug') === 'true';

        this._previouslyEnabled = !this.enabled;
        this.gui = new GUI();

        this.guiFolders = {
            general: this.gui.addFolder('General').close(),
            camera: this.gui.addFolder('Camera').close(),
        };

        this.params = { ...defaultDebugParams };
        this.gameStats = new GameStats();
        this.domElement.appendChild(this.gameStats.dom);

        this.statsGL = new Stats();
        this.statsGL.init(renderer.domElement);
        this.domElement.appendChild(this.statsGL.dom);

        this.statsGL.dom.style.left = '100px';

        this.guiFolders.general.add(this.params, 'freeze').onChange((value: boolean) => {
            this.renderer.freeze = value;
            // NB: Other way around!
            this.controls.enabled = !value;
        });

        this.guiFolders.camera
            .add(this.params, 'camera', ['perspective', 'orthographic'])
            .onChange((value: SupportedCameras) => {
                this.editor.setCamera(value);
            });

        controls.addDebug(this.guiFolders.camera);
        this.enabled = this._enabled;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    update(_delta: number) {
        this.statsGL.update();
    }

    dispose() {
        this.gui.destroy();
        this.gameStats.dom.remove();
    }
}
