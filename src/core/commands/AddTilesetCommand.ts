import { CommandBase } from './Command';
import { AddObjectCommand } from '.';
import { AddObjectCommandParams } from './AddObjectCommand';

export interface AddTilesetCommandBase extends CommandBase {
    object: THREE.Object3D;
}

export default class AddTilesetCommand extends AddObjectCommand {
    constructor(object: THREE.Object3D, params?: AddObjectCommandParams) {
        super(object, params);
        this.type = 'AddTilesetCommand';
    }

    undo() {}

    toJSON() {
        return this;
    }

    fromJSON(_json: AddTilesetCommandBase) {
        return this;
    }
}
