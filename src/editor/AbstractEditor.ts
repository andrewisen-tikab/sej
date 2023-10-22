/* eslint-disable class-methods-use-this */
import * as THREE from 'three';

import * as signals from 'signals';
import { HistoryObject } from '@andrewisen/error-manager';

import type { Command } from '../commands/types';
import { ErrorManager, Errors } from '../core/ErrorManager';
import { Debugger } from '../debugger/types';
import { AbstractHistory } from '../history/AbstractHistory';
import { AbstractLoaderManager } from '../loader/AbstractLoaderManager';
import type { LoaderManager } from '../loader/types';
import { AbstractSelector } from '../selector/AbstractSelector';
import { MobileUtils } from '../utils/MobileUtils';
import { Config } from './Config';
import type { Editor, EditorJSON, EditorSignals, Object3D } from './types';

// eslint-disable-next-line prefer-destructuring
const Signal = signals.Signal;

/**
 * Abstract class for all viewers.
 *
 * Each method begins with some manipulation of the scene, the objects or the camera.
 * This means that the arguments are sometimes mutated. This is fine. This is by design.
 *
 * Finally, when everything is ok - a signal is dispatched.
 * Check the methods' implementations for more details.
 */
export class AbstractEditor implements Editor {
    public config: Config;

    public loaderManager: LoaderManager;

    public scene: THREE.Scene;

    public camera: THREE.Camera;

    public signals: EditorSignals;

    public selector: AbstractSelector;

    public selected: Object3D | null;

    public history: AbstractHistory;

    public debugger: Debugger | null;

    public mobileUtils: MobileUtils;

    constructor() {
        this.signals = {
            objectSelected: new Signal(),
            objectFocused: new Signal(),
            objectAdded: new Signal(),
            objectChanged: new Signal(),
            objectRemoved: new Signal(),
            cameraAdded: new Signal(),
            cameraRemoved: new Signal(),
            cameraResetted: new Signal(),
            helperAdded: new Signal(),
            helperRemoved: new Signal(),
            windowResize: new Signal(),
            sceneGraphChanged: new Signal(),
            showGridChanged: new Signal(),
            showHelpersChanged: new Signal(),
            refreshSidebarObject3D: new Signal(),
            cameraChanged: new Signal(),
            refreshSidebarEnvironment: new Signal(),
            historyChanged: new Signal(),
            intersectionsDetected: new Signal(),
        };

        this.debugger = null;
        this.mobileUtils = MobileUtils;

        this.config = new Config();

        this.loaderManager = new AbstractLoaderManager();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        this.history = new AbstractHistory(this);

        this.selector = new AbstractSelector(this);
        this.selected = null;
    }

    public setScene(scene: THREE.Scene): void {
        // Copy most of the scene properties
        const {
            uuid,
            name,
            background,
            environment,
            fog,
            backgroundBlurriness,
            backgroundIntensity,
        } = scene;
        Object.assign(this.scene, {
            uuid,
            name,
            background,
            environment,
            fog,
            backgroundBlurriness,
            backgroundIntensity,
        });

        // Set the scene's userData to a deep copy of the original scene's userData
        this.scene.userData = JSON.parse(JSON.stringify(scene.userData));

        // Avoid render per object
        this.signals.sceneGraphChanged.active = false;

        while (scene.children.length > 0) this.addObject(scene.children[0]);

        this.signals.sceneGraphChanged.active = true;
        this.signals.sceneGraphChanged.dispatch();
    }

    public addObject(
        object: Object3D,
        parent?: Object3D | undefined,
        index?: number | undefined,
    ): void {
        if (parent === undefined) this.scene.add(object);
        else {
            parent.children.splice(index ?? parent.children.length - 1, 0, object);
            // eslint-disable-next-line no-param-reassign
            object.parent = parent; // Warning: Mutation!
        }

        this.signals.objectAdded.dispatch(object);
        this.signals.sceneGraphChanged.dispatch();
    }

    moveObject(
        object: Object3D,
        parent?: Object3D | undefined,
        before?: Object3D | undefined,
    ): void {
        // eslint-disable-next-line no-param-reassign
        if (parent === undefined) parent = this.scene; // Warning: Mutation!

        parent.add(object);

        // Sort children array
        if (before !== undefined) {
            const index = parent.children.indexOf(before);
            parent.children.splice(index, 0, object);
            parent.children.pop();
        }

        this.signals.sceneGraphChanged.dispatch();
    }

    nameObject(object: Object3D, name: string): void {
        // eslint-disable-next-line no-param-reassign
        object.name = name;

        this.signals.sceneGraphChanged.dispatch();
    }

    removeObject(object: Object3D): void {
        if (object.parent === null) return; // avoid deleting the camera or scene

        object.parent.remove(object);

        this.signals.objectRemoved.dispatch(object);
        this.signals.sceneGraphChanged.dispatch();
    }

    select(object: Object3D | null): void {
        this.selector.select(object);
    }

    selectById(id: number): void {
        if (id === this.camera.id) {
            this.select(this.camera);
            return;
        }

        const object = this.scene.getObjectById(id);

        // eslint-disable-next-line no-console
        if (object === undefined) {
            ErrorManager.addHistory(
                new HistoryObject(
                    Errors.EDITOR_SELECT_OBJECT_BY_ID_NOT_FOUND.key,
                    Errors.EDITOR_SELECT_OBJECT_BY_ID_NOT_FOUND.message(id),
                ),
            );
            return;
        }

        this.select(object);
    }

    selectByUuid(uuid: string, traverse: boolean = false): void {
        /**
         * Determine if the child's uuid matches the uuid we are looking for.
         * @param child
         */
        const callback = (child: THREE.Object3D) => {
            if (child.uuid === uuid) this.select(child);
        };

        traverse ? this.scene.traverse(callback) : this.scene.children.forEach(callback);
    }

    deselect(): void {
        this.selector.deselect();
    }

    objectByUuid(uuid: string): Object3D | undefined {
        return this.scene.getObjectByProperty('uuid', uuid);
    }

    execute(command: Command, optionalName?: string) {
        this.history.execute(command, optionalName);
    }

    undo() {
        return this.history.undo();
    }

    redo() {
        return this.history.redo();
    }

    fromJSON(json: EditorJSON) {
        /**
         * Asynchronously parse the JSON file.
         */
        const fromJSONAsync = async () => {
            const loader = new THREE.ObjectLoader();
            const camera = await loader.parseAsync(json.camera);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.camera.copy(camera as any);
            this.signals.cameraResetted.dispatch();

            this.history.fromJSON(json.history);

            this.setScene((await loader.parseAsync(json.scene)) as THREE.Scene);
        };

        fromJSONAsync();
    }

    toJSON(): EditorJSON {
        const json: EditorJSON = {
            camera: this.camera.toJSON(),
            scene: this.scene.toJSON(),
            history: this.history.toJSON(),
        };
        return json;
    }

    focus(object: Object3D) {
        if (object == null) return;
        if (object.isObject3D !== true) return;
        this.signals.objectFocused.dispatch(object);
    }

    test(): boolean {
        // Create a new object
        const object = new THREE.Object3D();

        // Expect the object to be in the scene
        const find = this.objectByUuid(object.uuid);

        if (find?.uuid !== object.uuid) return false;

        // Undo the command and expect the object to be removed
        this.undo();
        const notFound = this.objectByUuid(object.uuid);

        if (notFound?.uuid === object.uuid) return false;

        // Redo the command and expect the object to be in the scene again
        this.redo();
        const findAgain = this.objectByUuid(object.uuid);

        if (findAgain?.uuid !== object.uuid) return false;

        return true;
    }
}
