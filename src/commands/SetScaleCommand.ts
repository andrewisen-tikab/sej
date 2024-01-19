import * as THREE from 'three';

import { Editor } from '../editor/types';
import { AbstractCommand } from './AbstractCommand';
import type { CommandJSON } from './types';

export type SetScaleCommandJSON = CommandJSON & {
    objectUuid?: string;
    oldScale?: number[];
    newScale?: number[];
};

/**
 * Set scale command.
 */
export class SetScaleCommand extends AbstractCommand {
    object?: THREE.Object3D;

    newScale?: THREE.Vector3;

    oldScale?: THREE.Vector3;

    /**
     * Set scale command.
     * @param editor Pointer to {@link Editor}.
     * @param object Object to add.
     * @param newScale New scale.
     * @param optionalOldScale Optional old scale.
     */
    constructor(
        editor: Editor,
        object?: THREE.Object3D,
        newScale?: THREE.Vector3,
        optionalOldScale?: THREE.Vector3,
    ) {
        super(editor);

        this.type = 'SetScaleCommand';
        this.name = 'Set Scale';
        this.updatable = true;

        this.object = object;

        if (object !== undefined && newScale !== undefined) {
            this.oldScale = object.scale.clone();
            this.newScale = newScale.clone();
        }

        if (optionalOldScale !== undefined) {
            this.oldScale = optionalOldScale.clone();
        }
    }

    execute(): void {
        if (this.object == null) return;
        if (this.newScale == null) return;
        this.object.scale.copy(this.newScale);
        this.object.updateMatrixWorld(true);
        this.editor.signals.objectChanged.dispatch(this.object);
    }

    undo(): void {
        if (this.object == null) return;
        if (this.oldScale == null) return;
        this.object.scale.copy(this.oldScale);
        this.object.updateMatrixWorld(true);
        this.editor.signals.objectChanged.dispatch(this.object);
    }

    update(command: SetScaleCommand) {
        if (this.newScale == null) return;
        if (command.newScale == null) return;
        this.newScale.copy(command.newScale);
    }

    toJSON(): SetScaleCommandJSON {
        const commandOutput = super.toJSON();

        const json: SetScaleCommandJSON = {
            ...commandOutput,
            objectUuid: this.object?.uuid,
            oldScale: this.oldScale?.toArray(),
            newScale: this.newScale?.toArray(),
        };

        return json;
    }

    fromJSON(json: SetScaleCommandJSON): void {
        super.fromJSON(json);

        if (json.objectUuid == null) return;
        if (json.oldScale == null) return;
        if (json.newScale == null) return;

        this.object = this.editor.objectByUuid(json.objectUuid);
        this.oldScale = new THREE.Vector3().fromArray(json.oldScale);
        this.newScale = new THREE.Vector3().fromArray(json.newScale);
    }

    test() {
        this.execute();
        return true;
    }
}
