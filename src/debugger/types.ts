import GameStats from 'gamestats.js';
import GUI from 'lil-gui';
import Stats from 'stats-gl';

import type { SupportedCameras } from '../core/types';
import type { Renderer } from '../renderer/types';

/**
 * Debug parameters for the Debugger.
 */
export type DebugParams = {
    /**
     * Freeze the entire `SejEngine` instance.
     * Useful for debugging or if you want to perform resource intensive tasks.
     * @default false
     */
    freeze: boolean;
    camera: SupportedCameras;
};

/**
 * Debug folders for the Debugger.
 */
export type DebugFolders = {
    general: GUI;
    camera: GUI;
};

/**
 * Default debug parameters.
 */
export const defaultDebugParams: DebugParams = {
    freeze: false,
    camera: 'perspective',
};

/**
 * Debugger based on [lil-gui](https://lil-gui.georgealways.com/).
 * The debugger makes a floating panel for controllers.
 */
export type Debugger = {
    /**
     * The DOM element that the debugger is attached to.
     */
    domElement: HTMLElement;
    /**
     * Renderer instance.
     */
    renderer: Renderer;
    /**
     * Whether the debugger is enabled or not.
     * It's always enabled when developing locally.
     *
     * Otherwise, set `debug=true` in localStorage to enable it.
     */
    enabled: boolean;
    /**
     * The GUI instance.
     */
    gui: GUI;
    /**
     * The GUI folders.
     */
    guiFolders: DebugFolders;
    /**
     * The debug parameters.
     */
    params: DebugParams;
    /**
     * The stats instance.
     */
    gameStats: GameStats;
    statsGL: Stats;
    /**
     * Call this on every frame to update the debugger.
     * @param delta
     */
    update: (delta: number) => void;
    dispose: () => void;
};

/**
 * Allows you to add your own debug options to the debugger.
 */
export type AddDebug = {
    /**
     * This allows all components to add their own debug options to the debugger.
     *
     * For example, the `controls`.
     * One controls may provide a set of debug options while another may provide a slightly different set.
     *
     * @param gui The GUI instance to add the debug options to.
     */
    addDebug(gui: GUI): void;
};
