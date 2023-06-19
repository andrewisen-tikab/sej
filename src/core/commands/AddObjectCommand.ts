import { ObjectLoader } from 'three';
import Command, { CommandBase } from './Command';
import Sej from '../..';

export interface AddObjectCommandBase extends CommandBase {
    object: THREE.Object3D;
}

export type AddObjectCommandParams = Partial<
    Pick<THREE.Object3D, 'position' | 'rotation' | 'scale'>
>;

export default class AddObjectCommand extends Command {
    object: THREE.Object3D;

    constructor(object: THREE.Object3D, params?: AddObjectCommandParams) {
        super();

        this.type = 'AddObjectCommand';

        this.object = object;
        if (object !== undefined) {
            this.name = `Add Object: ${object.name}`;
        }

        if (params) {
            const { position, rotation, scale } = params;
            if (position) this.object.position.copy(position);
            if (rotation) this.object.rotation.copy(rotation);
            if (scale) this.object.scale.copy(scale);
            this.object.updateMatrix();
        }
    }

    execute() {
        Sej.api.addObject(this.object);
    }

    undo() {
        Sej.api.removeObject(this.object);
    }

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
