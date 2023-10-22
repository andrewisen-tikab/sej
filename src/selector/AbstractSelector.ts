import * as THREE from 'three';

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
                this.select(null);
            }
        });
    }

    select(object: THREE.Object3D | null) {
        if (this.editor.selected === object) return;

        let uuid: string | null = null;

        if (object !== null) {
            ({ uuid } = object);
        }

        this.editor.selected = object;
        this.editor.config.setKey('selected', uuid);

        this.editor.signals.objectSelected.dispatch(object);
    }

    deselect() {
        this.select(null);
    }

    test() {
        const object = new THREE.Object3D();

        this.select(object);
        if (this.editor.selected !== object) return false;

        this.deselect();
        if (this.editor.selected !== null) return false;

        return true;
    }
}
