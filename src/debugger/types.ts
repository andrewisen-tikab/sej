import GUI from 'lil-gui';
import Stats from 'three/addons/libs/stats.module.js';

import type { Renderer } from '../renderer/types';

export type DebugParams = {
    /**
     * Freeze the entire `SejEngine` instance.
     * Useful for debugging or if you want to perform resource intensive tasks.
     * @default false
     */
    freeze: boolean;
};

export type DebugFolders = {
    general: GUI;
};

export const defaultDebugParams: DebugParams = {
    freeze: false,
};

export type Debugger = {
    domElement: HTMLElement;
    renderer: Renderer;

    enabled: boolean;
    gui: GUI;
    guiFolders: DebugFolders;

    params: DebugParams;
    stats: Stats;
    /**
     * Call this on every frame to update the debugger.
     * @param delta
     */
    update: (delta: number) => void;
};
