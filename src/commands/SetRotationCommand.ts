import * as THREE from 'three';

import { Editor } from '../editor/types';
import { AbstractCommand } from './AbstractCommand';
import type { CommandJSON } from './types';

export type SetRotationCommandJSON = CommandJSON & {
    objectUuid?: string;
    oldRotation?: number[];
    newRotation?: number[];
};

/**
 * Set rotation command.
 */
export class SetRotationCommand extends AbstractCommand {
    object?: THREE.Object3D;

    newRotation?: THREE.Euler;

    oldRotation?: THREE.Euler;

    /**
     * Set rotation command.
     * @param editor Pointer to {@link Editor}.
     * @param object Object to add.
     * @param newRotation New rotation.
     * @param optionalOldRotation Optional old rotation.
     */
    constructor(
        editor: Editor,
        object?: THREE.Object3D,
        newRotation?: THREE.Euler,
        optionalOldRotation?: THREE.Euler,
    ) {
        super(editor);

        this.type = 'SetRotationCommand';
        this.name = 'Set Rotation';
        this.updatable = true;

        this.object = object;

        if (object !== undefined && newRotation !== undefined) {
            this.oldRotation = object.rotation.clone();
            this.newRotation = newRotation.clone();
        }

        if (optionalOldRotation !== undefined) {
            this.oldRotation = optionalOldRotation.clone();
        }
    }

    execute(): void {
        if (this.object == null) return;
        if (this.newRotation == null) return;
        this.object.rotation.copy(this.newRotation);
        this.object.updateMatrixWorld(true);
        this.editor.signals.objectChanged.dispatch(this.object);
    }

    undo(): void {
        if (this.object == null) return;
        if (this.oldRotation == null) return;
        this.object.rotation.copy(this.oldRotation);
        this.object.updateMatrixWorld(true);
        this.editor.signals.objectChanged.dispatch(this.object);
    }

    update(command: SetRotationCommand) {
        if (this.newRotation == null) return;
        if (command.newRotation == null) return;
        this.newRotation.copy(command.newRotation);
    }

    toJSON(): SetRotationCommandJSON {
        const commandOutput = super.toJSON();

        const json: SetRotationCommandJSON = {
            ...commandOutput,
            objectUuid: this.object?.uuid,
            oldRotation: this.oldRotation?.toArray() as number[],
            newRotation: this.newRotation?.toArray() as number[],
        };

        return json;
    }

    fromJSON(json: SetRotationCommandJSON): void {
        super.fromJSON(json);

        if (json.objectUuid == null) return;
        if (json.oldRotation == null) return;
        if (json.newRotation == null) return;

        this.object = this.editor.objectByUuid(json.objectUuid);
        this.oldRotation = new THREE.Euler().fromArray(
            json.oldRotation as [number, number, number, THREE.EulerOrder | undefined],
        );
        this.newRotation = new THREE.Euler().fromArray(
            json.newRotation as [number, number, number, THREE.EulerOrder | undefined],
        );
    }

    test() {
        this.execute();
        return true;
    }
}
