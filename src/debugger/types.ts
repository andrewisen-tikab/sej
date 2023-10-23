import GUI from 'lil-gui';
import Stats from 'three/addons/libs/stats.module.js';

import type { SupportedCameras } from '../core/types';
import type { Renderer } from '../renderer/types';

export type DebugParams = {
    /**
     * Freeze the entire `SejEngine` instance.
     * Useful for debugging or if you want to perform resource intensive tasks.
     * @default false
     */
    freeze: boolean;
    camera: SupportedCameras;
};

export type DebugFolders = {
    general: GUI;
    camera: GUI;
};

export const defaultDebugParams: DebugParams = {
    freeze: false,
    camera: 'perspective',
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

export type AddDebug = {
    addDebug(gui: GUI): void;
};
