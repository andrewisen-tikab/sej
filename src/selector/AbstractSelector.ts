import * as THREE from 'three';

import { HistoryObject } from '@andrewisen/error-manager';

import { ErrorManager, Errors } from '../core/ErrorManager';
import { Editor } from '../editor/types';
import { Selector } from './types';

/**
 * Abstract selector class for all selectors.
 */
export class AbstractSelector implements Selector {
    editor: Editor;

    constructor(editor: Editor) {
        this.editor = editor;
        const { signals } = editor;

        // signals

        signals.intersectionsDetected.add((intersects) => {
            if (intersects.length > 0) {
                const [{ object }] = intersects;
                // helper
                object.userData.object !== undefined
                    ? this.select(object.userData.object)
                    : this.select(object);
            } else {
                this.deselect();
            }
        });
    }

    /**
     * Select one or more objects.
     * If the object is already selected, it will be ignored.
     *
     * If there are multiple objects, an `objectsSelected` signal will be dispatched.
     * Else, an `objectSelected` signal will be dispatched.
     * @param object Object or objects to select.
     */
    select(object: THREE.Object3D | THREE.Object3D[]): void {
        if (Array.isArray(object)) {
            const newlySelectedObjects = object.filter((o) => !this.editor.selected.includes(o));
            newlySelectedObjects.forEach((o) => this._select(o));
            this.editor.signals.objectsSelected.dispatch(object);
        } else {
            // Check if the object is already this.editor.selected array
            if (this.editor.selected.includes(object)) return;
            this._select(object);
            this.editor.signals.objectSelected.dispatch(object);
        }
    }

    /**
     * Selects an object.
     * @param object Object to select.
     */
    private _select(object: THREE.Object3D) {
        this.editor.selected.push(object);
        this.editor.config.setKey(
            'selected',
            this.editor.selected.map((o) => o.uuid),
        );
    }

    deselect(object?: THREE.Object3D) {
        // If no object is passed, deselect all objects
        if (object === undefined) {
            this.editor.selected = [];
            this.editor.signals.objectsDeselected.dispatch();
        } else {
            // Check if the object is in the this.editor.selected array
            const index = this.editor.selected.indexOf(object);
            if (index !== -1) {
                this.editor.signals.objectDeselected.dispatch(object);
                this.editor.selected.splice(index, 1);
            } else {
                // If the object is not in the this.editor.selected array, throw an error
                ErrorManager.addHistory(
                    new HistoryObject(
                        Errors.SELECTOR_OBJECT_NOT_FOUND.key,
                        Errors.SELECTOR_OBJECT_NOT_FOUND.message(object.uuid),
                    ),
                );
            }
        }
    }

    test() {
        const object = new THREE.Object3D();

        this.select(object);
        if (this.editor.selected.includes(object) === false) return false;

        this.deselect();
        if (this.editor.selected.includes(object)) return false;

        return true;
    }
}
