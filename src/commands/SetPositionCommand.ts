import * as THREE from 'three';

import { Editor } from '../editor/types';
import { AbstractCommand } from './AbstractCommand';
import type { CommandJSON } from './types';

export type SetPositionCommandJSON = CommandJSON & {
    objectUuid?: string;
    oldPosition?: number[];
    newPosition?: number[];
};

/**
 * Set position command.
 */
export class SetPositionCommand extends AbstractCommand {
    object?: THREE.Object3D;

    newPosition?: THREE.Vector3;

    oldPosition?: THREE.Vector3;

    /**
     * Set position command.
     * @param editor Pointer to {@link Editor}.
     * @param object Object to add.
     * @param newPosition New position.
     * @param optionalOldPosition Optional old position.
     */
    constructor(
        editor: Editor,
        object?: THREE.Object3D,
        newPosition?: THREE.Vector3,
        optionalOldPosition?: THREE.Vector3,
    ) {
        super(editor);

        this.type = 'SetPositionCommand';
        this.name = 'Set Position';
        this.updatable = true;

        this.object = object;

        if (object !== undefined && newPosition !== undefined) {
            this.oldPosition = object.position.clone();
            this.newPosition = newPosition.clone();
        }

        if (optionalOldPosition !== undefined) {
            this.oldPosition = optionalOldPosition.clone();
        }
    }

    execute(): void {
        if (this.object == null) return;
        if (this.newPosition == null) return;
        this.object.position.copy(this.newPosition);
        this.object.updateMatrixWorld(true);
        this.editor.signals.objectChanged.dispatch(this.object);
    }

    undo(): void {
        if (this.object == null) return;
        if (this.oldPosition == null) return;
        this.object.position.copy(this.oldPosition);
        this.object.updateMatrixWorld(true);
        this.editor.signals.objectChanged.dispatch(this.object);
    }

    update(command: SetPositionCommand) {
        if (this.newPosition == null) return;
        if (command.newPosition == null) return;
        this.newPosition.copy(command.newPosition);
    }

    toJSON(): SetPositionCommandJSON {
        const commandOutput = super.toJSON();

        const json: SetPositionCommandJSON = {
            ...commandOutput,
            objectUuid: this.object?.uuid,
            oldPosition: this.oldPosition?.toArray(),
            newPosition: this.newPosition?.toArray(),
        };

        return json;
    }

    fromJSON(json: SetPositionCommandJSON): void {
        super.fromJSON(json);

        if (json.objectUuid == null) return;
        if (json.oldPosition == null) return;
        if (json.newPosition == null) return;

        this.object = this.editor.objectByUuid(json.objectUuid);
        this.oldPosition = new THREE.Vector3().fromArray(json.oldPosition);
        this.newPosition = new THREE.Vector3().fromArray(json.newPosition);
    }

    test() {
        this.execute();
        return true;
    }
}
