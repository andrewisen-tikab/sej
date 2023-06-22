import * as THREE from 'three';
import Command, { CommandBase } from './Command';
import { SejCore, SejEventKeys } from '../..';
import ErrorManager from '../../utils/ErrorManager';

export interface SetPositionCommandBase extends CommandBase {
    object: THREE.Object3D;
    objectUuid: string;
    oldPosition: THREE.Vector3Tuple;
    newPosition: THREE.Vector3Tuple;
}

export default class SetPositionCommand extends Command {
    private object: THREE.Object3D;

    private oldPosition?: THREE.Vector3;

    private newPosition?: THREE.Vector3;

    constructor(
        object: THREE.Object3D,
        newPosition: THREE.Vector3,
        optionalOldPosition?: THREE.Vector3,
    ) {
        super();

        this.type = 'SetPositionCommand';
        this.name = 'Set Position';

        this.object = object;

        if (object !== undefined && newPosition !== undefined) {
            this.oldPosition = object.position.clone();
            this.newPosition = newPosition.clone();
        }

        if (optionalOldPosition !== undefined) {
            this.oldPosition = optionalOldPosition.clone();
        }
    }

    execute() {
        if (this.newPosition === undefined) throw new Error(ErrorManager.Commands.newPosition);

        this.object.position.copy(this.newPosition);
        this.object.updateMatrixWorld(true);
        SejCore.dispatchEvent({ type: SejEventKeys.objectChanged, data: { object: this.object } });
    }

    undo() {
        if (this.oldPosition === undefined) throw new Error(ErrorManager.Commands.oldPosition);

        this.object.position.copy(this.oldPosition);
        this.object.updateMatrixWorld(true);
        SejCore.dispatchEvent({
            type: SejEventKeys.objectChanged,
            data: { object: this.object },
        });
    }

    toJSON() {
        if (this.newPosition === undefined) throw new Error(ErrorManager.Commands.newPosition);
        if (this.oldPosition === undefined) throw new Error(ErrorManager.Commands.oldPosition);

        const output = super.toJSON() as SetPositionCommandBase;

        output.object = this.object.toJSON();
        output.objectUuid = this.object.uuid;
        output.oldPosition = this.oldPosition.toArray();
        output.newPosition = this.newPosition.toArray();

        return output;
    }

    fromJSON(json: SetPositionCommandBase) {
        super.fromJSON(json);
        const object = SejCore.api.getObjectByUUID(json.objectUuid);
        if (object === undefined) throw new Error(ErrorManager.Commands.newPosition);

        this.object = object;
        this.oldPosition = new THREE.Vector3().fromArray(json.oldPosition);
        this.newPosition = new THREE.Vector3().fromArray(json.newPosition);
    }
}
