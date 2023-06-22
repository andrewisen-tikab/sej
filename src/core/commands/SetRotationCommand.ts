import * as THREE from 'three';
import Command, { CommandBase } from './Command';
import { SejCore, SejEventKeys } from '../..';
import ErrorManager from '../../utils/ErrorManager';

type RotationArray = [number, number, number, THREE.EulerOrder?, ...any[]];

export interface SetRotationCommandBase extends CommandBase {
    object: THREE.Object3D;
    objectUuid: string;
    oldRotation: [number, number, number, THREE.EulerOrder?, ...any[]];
    newRotation: [number, number, number, THREE.EulerOrder?, ...any[]];
}

export default class SetRotationCommand extends Command {
    private object: THREE.Object3D;

    private oldRotation?: THREE.Euler;

    private newRotation?: THREE.Euler;

    constructor(
        object: THREE.Object3D,
        newRotation: THREE.Euler,
        optionaloldRotation?: THREE.Euler,
    ) {
        super();

        this.type = 'SetRotationCommand';
        this.name = 'Set Rotation';

        this.object = object;

        if (object !== undefined && newRotation !== undefined) {
            this.oldRotation = object.rotation.clone();
            this.newRotation = newRotation.clone();
        }

        if (optionaloldRotation !== undefined) {
            this.oldRotation = optionaloldRotation.clone();
        }
    }

    execute() {
        if (this.newRotation === undefined) throw new Error(ErrorManager.Commands.newRotation);

        this.object.rotation.copy(this.newRotation);
        this.object.updateMatrixWorld(true);
        SejCore.dispatchEvent({ type: SejEventKeys.objectChanged, data: { object: this.object } });
    }

    undo() {
        if (this.oldRotation === undefined) throw new Error(ErrorManager.Commands.oldRotation);

        this.object.rotation.copy(this.oldRotation);
        this.object.updateMatrixWorld(true);
        SejCore.dispatchEvent({
            type: SejEventKeys.objectChanged,
            data: { object: this.object },
        });
    }

    toJSON() {
        if (this.newRotation === undefined) throw new Error(ErrorManager.Commands.newRotation);
        if (this.oldRotation === undefined) throw new Error(ErrorManager.Commands.oldRotation);

        const output = super.toJSON() as SetRotationCommandBase;

        output.object = this.object.toJSON();
        output.objectUuid = this.object.uuid;
        output.oldRotation = this.oldRotation.toArray() as RotationArray;
        output.newRotation = this.newRotation.toArray() as RotationArray;

        return output;
    }

    fromJSON(json: SetRotationCommandBase) {
        super.fromJSON(json);
        const object = SejCore.api.getObjectByUUID(json.objectUuid);
        if (object === undefined) throw new Error(ErrorManager.Commands.newRotation);

        this.object = object;
        this.oldRotation = new THREE.Euler().fromArray(json.oldRotation);
        this.newRotation = new THREE.Euler().fromArray(json.newRotation);
    }
}
