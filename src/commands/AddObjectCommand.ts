import * as THREE from 'three';

import { Editor } from '../editor/types';
import { AbstractCommand } from './AbstractCommand';
import type { CommandJSON } from './types';

export type AddObjectCommandJSON = CommandJSON & {
    /**
     * Object as JSON.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    object: any;
};

/**
 * Add object command.
 */
export class AddObjectCommand extends AbstractCommand {
    object?: THREE.Object3D;

    /**
     * Add object command.
     * @param editor Pointer to {@link Editor}.
     * @param object Object to add.
     */
    constructor(editor: Editor, object?: THREE.Object3D) {
        super(editor);

        this.type = 'AddObjectCommand';

        this.object = object;
        if (object !== undefined) {
            this.name = `Add Object: ${object.name}`;
        }
    }

    execute(): void {
        if (this.object == null) return;
        this.editor.addObject(this.object);
    }

    undo(): void {
        if (this.object == null) return;
        this.editor.removeObject(this.object);
    }

    toJSON(): AddObjectCommandJSON {
        const commandOutput = super.toJSON();

        const json: AddObjectCommandJSON = {
            ...commandOutput,
            object: this.object?.toJSON(),
        };

        return json;
    }

    fromJSON(json: AddObjectCommandJSON): void {
        super.fromJSON(json);

        const object = this.editor.objectByUuid(json.object.object.uuid);

        if (object === undefined) {
            const loader = new THREE.ObjectLoader();
            this.object = loader.parse(json.object);
        } else {
            this.object = object;
        }
    }

    test() {
        this.execute();
        const result = this.editor.scene.children.includes(this.object!);
        return result;
    }
}
