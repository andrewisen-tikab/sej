import { ObjectLoader } from 'three';
import Command, { CommandBase } from './Command';
import Sej from '../..';

export interface AddTilesetCommandBase extends CommandBase {
    object: THREE.Object3D;
}

export default class AddTilesetCommand extends Command {
    object: THREE.Object3D;

    constructor(object: THREE.Object3D) {
        super();

        this.type = 'AddTilesetCommand';

        this.object = object;
        if (object !== undefined) {
            this.name = `Add Object: ${object.name}`;
        }
    }

    execute() {
        Sej.api.addObject(this.object);
    }

    undo() {}

    toJSON() {
        return this;
    }

    fromJSON(json: AddTilesetCommandBase) {
        return this;
    }
}
