import * as THREE from 'three';

import * as signals from 'signals';

import type { SerializableObject, SupportedCameras, Test } from '../core/types';
import type { Debugger } from '../debugger/types';
import type { GISHelper } from '../gis/types';
import type { History } from '../history/types';
import type { LoaderManager } from '../loader/types';
import { Selector } from '../selector/types';
import { Config } from './Config';

type GenericSignalType = signals.Signal;

export type Object3D = THREE.Object3D<THREE.Object3DEventMap>;

export type EditorSignals = {
    objectSelected: GenericSignalType;
    objectFocused: GenericSignalType;

    objectAdded: signals.Signal<THREE.Object3D>;
    objectChanged: signals.Signal<THREE.Object3D>;
    objectRemoved: signals.Signal<THREE.Object3D>;

    intersectionsDetected: signals.Signal<THREE.Intersection[]>;

    cameraAdded: GenericSignalType;
    cameraRemoved: GenericSignalType;
    cameraResetted: GenericSignalType;
    helperAdded: GenericSignalType;
    helperRemoved: GenericSignalType;
    windowResize: GenericSignalType;
    sceneGraphChanged: GenericSignalType;
    showGridChanged: GenericSignalType;
    showHelpersChanged: GenericSignalType;
    refreshSidebarObject3D: GenericSignalType;
    cameraChanged: GenericSignalType;
    setCamera: signals.Signal<SupportedCameras>;
    refreshSidebarEnvironment: GenericSignalType;
    historyChanged: GenericSignalType;
};

/**
 * The `Editor` is the meat of the application.
 * It holds the scene, the camera, the signals, the loader manager, the selector, the debugger and the config.
 */
export type Editor = {
    config: Config;

    scene: THREE.Scene;

    camera: THREE.Camera;

    perspectiveCamera: THREE.PerspectiveCamera;

    orthographicCamera: THREE.OrthographicCamera;

    signals: EditorSignals;

    loaderManager: LoaderManager;

    selector: Selector;

    selected: Object3D | null;

    gisHelper: GISHelper;

    debugger: Debugger | null;

    /**
     * Set the {@link THREE.Scene | Scene} to be rendered.
     * @param scene {@link THREE.Scene | Scene} to be rendered.
     */
    setScene: (scene: THREE.Scene) => void;
    /**
     * Add an {@link Object3D | object} to the parent or scene.
     * @param object  {@link Object3D | Object} to be added
     * @param parent {@link Object3D | Parent} of the object. Fallback to scene if not provided.
     * @param index Index of the {@link Object3D | object} to be added in the parent
     */
    addObject: (object: Object3D, parent?: Object3D, index?: number) => void;
    /**
     * Move an {@link Object3D | object} to the parent or scene.s
     * Remove the object from the original parent if it exists.
     * @param object {@link Object3D | Object} to be moved
     * @param parent New {@link Object3D | parent} of the object. Fallback to scene if not provided.
     * @param before Previous {@link Object3D | parent} of the object.
     * @returns
     */
    moveObject: (object: Object3D, parent?: Object3D, before?: Object3D) => void;
    /**
     * Rename an {@link Object3D | object}.
     * @param object {@link Object3D | Object} to be renamed
     * @param name New name of the object
     */
    nameObject: (object: Object3D, name: string) => void;
    /**
     * Remove an object from its parent.
     * @param object Object to be removed
     */
    removeObject: (object: Object3D) => void;
    /**
     * Select an {@link Object3D | object} by its id.
     * @param id {@link THREE.Object3D.id | Id} of the object to be selected
     */
    selectById: (id: number) => void;
    /**
     * Select an {@link Object3D | object} by its uuid.
     * @param uuid {@link THREE.Object3D.uuid | uuid} of the object to be selected
     */
    selectByUuid: (uuid: string) => void;
    /**
     * Get an {@link Object3D | object} by its uuid.
     * @param uuid UUID of the object
     * @returns {@link Object3D | Object} with the given uuid
     */
    objectByUuid: (uuid: string) => Object3D | undefined;
    /**
     * Focus on an {@link Object3D | object}.
     * @param object
     */
    focus: (object: Object3D) => void;
    /**
     * Set the {@link SupportedCameras | Camera} to be used.
     * This will switch the camera internally and dispatch a signal.
     * @param camera {@link SupportedCameras | Camera} to be set
     */
    setCamera: (camera: SupportedCameras) => void;
} & Pick<History, 'execute' | 'undo' | 'redo'> &
    Pick<Selector, 'select' | 'deselect'> &
    SerializableObject &
    Test;

export type ConfigStorage = {
    language: string;
    autosave: boolean;
    'settings/history': boolean;
    selected: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type EditorJSON = {
    camera: any;
    scene: any;
    history: any;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export type EditorPointer = {
    /**
     * Pointer to main editor object used to initialize
     */
    editor: Editor;
};
