import * as THREE from 'three';
import Command, { CommandBase } from './Command';
import { SejCore, SejEventKeys } from '../..';
import ErrorManager from '../../utils/ErrorManager';

export interface SetScaleCommandBase extends CommandBase {
    object: THREE.Object3D;
    objectUuid: string;
    oldScale: THREE.Vector3Tuple;
    newScale: THREE.Vector3Tuple;
}

export default class SetScaleCommand extends Command {
    private object: THREE.Object3D;

    private oldScale?: THREE.Vector3;

    private newScale?: THREE.Vector3;

    constructor(
        object: THREE.Object3D,
        newScale: THREE.Vector3,
        optionalOldPosition?: THREE.Vector3,
    ) {
        super();

        this.type = 'SetScaleCommand';
        this.name = 'Set Position';

        this.object = object;

        if (object !== undefined && newScale !== undefined) {
            this.oldScale = object.scale.clone();
            this.newScale = newScale.clone();
        }

        if (optionalOldPosition !== undefined) {
            this.oldScale = optionalOldPosition.clone();
        }
    }

    execute() {
        if (this.newScale === undefined) throw new Error(ErrorManager.Commands.newScale);

        this.object.scale.copy(this.newScale);
        this.object.updateMatrixWorld(true);
        SejCore.dispatchEvent({ type: SejEventKeys.objectChanged, data: { object: this.object } });
    }

    undo() {
        if (this.oldScale === undefined) throw new Error(ErrorManager.Commands.oldScale);

        this.object.scale.copy(this.oldScale);
        this.object.updateMatrixWorld(true);
        SejCore.dispatchEvent({
            type: SejEventKeys.objectChanged,
            data: { object: this.object },
        });
    }

    toJSON() {
        if (this.newScale === undefined) throw new Error(ErrorManager.Commands.newScale);
        if (this.oldScale === undefined) throw new Error(ErrorManager.Commands.oldScale);

        const output = super.toJSON() as SetScaleCommandBase;

        output.object = this.object.toJSON();
        output.objectUuid = this.object.uuid;
        output.oldScale = this.oldScale.toArray();
        output.newScale = this.newScale.toArray();

        return output;
    }

    fromJSON(json: SetScaleCommandBase) {
        super.fromJSON(json);
        const object = SejCore.api.getObjectByUUID(json.objectUuid);
        if (object === undefined) throw new Error(ErrorManager.Commands.newScale);

        this.object = object;
        this.oldScale = new THREE.Vector3().fromArray(json.oldScale);
        this.newScale = new THREE.Vector3().fromArray(json.newScale);
    }
}
