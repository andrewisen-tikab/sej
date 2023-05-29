import { ObjectLoader } from 'three';
import Command, { CommandBase } from './Command';
import Sej from '../..';

export interface AddObjectCommandBase extends CommandBase {
    object: THREE.Object3D;
}

export default class AddObjectCommand extends Command {
    object: THREE.Object3D;

    constructor(object: THREE.Object3D) {
        super();

        this.type = 'AddObjectCommand';

        this.object = object;
        if (object !== undefined) {
            this.name = `Add Object: ${object.name}`;
        }
    }

    execute() {
        Sej.addObject(this.object);
    }

    undo() {}

    toJSON() {
        const output = super.toJSON() as AddObjectCommandBase;

        output.object = this.object.toJSON();

        return output;
    }

    fromJSON(json: AddObjectCommandBase) {
        super.fromJSON(json);

        const loader = new ObjectLoader();
        this.object = loader.parse(json.object);
    }
}
