import * as THREE from 'three';

import { Editor } from '../editor/types';
import { AbstractCommand } from './AbstractCommand';
import type { CommandJSON } from './types';

export type RemoveObjectCommandJSON = CommandJSON & {
    /**
     * Object as JSON.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    object: any;
    index?: number;
    parentUuid?: string;
};

/**
 * Remove object command.
 */
export class RemoveObjectCommand extends AbstractCommand {
    object?: THREE.Object3D;

    parent?: THREE.Object3D | null;

    index?: number;

    /**
     * Remove object command.
     * @param editor Pointer to {@link Editor}.
     * @param object Object to remove.
     */
    constructor(editor: Editor, object?: THREE.Object3D) {
        super(editor);

        this.type = 'RemoveObjectCommand';

        this.object = object;
        this.parent = object !== undefined ? object.parent : undefined;
        if (this.object && this.parent) {
            this.index = this.parent!.children.indexOf(this.object);
        }
    }

    execute(): void {
        if (this.object == null) return;
        this.editor.removeObject(this.object);
        this.editor.deselect();
    }

    undo(): void {
        if (this.object == null) return;
        this.editor.addObject(this.object, this.parent!, this.index);
        this.editor.select(this.object);
    }

    toJSON(): RemoveObjectCommandJSON {
        const commandOutput = super.toJSON();

        const json: RemoveObjectCommandJSON = {
            ...commandOutput,
            object: this.object?.toJSON(),
            index: this.index,
            parentUuid: this.parent?.uuid,
        };

        return json;
    }

    fromJSON(json: RemoveObjectCommandJSON): void {
        super.fromJSON(json);

        this.parent = json.parentUuid ? this.editor.objectByUuid(json.parentUuid) : undefined;
        if (this.parent === undefined) this.parent = this.editor.scene;

        this.index = json.index;

        this.object = this.editor.objectByUuid(json.object.object.uuid)!;

        if (this.object === undefined) {
            const loader = new THREE.ObjectLoader();
            this.object = loader.parse(json.object);
        }
    }

    test() {
        this.execute();
        const result = this.editor.scene.children.includes(this.object!) === false;
        return result;
    }
}
