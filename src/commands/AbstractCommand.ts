import type { Editor } from '../editor/types';
import type { Command, CommandJSON } from './types';

/**
 * Abstract class for all commands.
 */
export class AbstractCommand implements Command {
    public editor: Editor;

    public id: number;

    public inMemory: boolean;

    public updatable: boolean;

    public type: string;

    public name: string;

    public json: CommandJSON | undefined;

    constructor(editor: Editor) {
        this.editor = editor;
        this.id = -1;
        this.inMemory = false;
        this.updatable = false;
        this.type = '';
        this.name = '';
    }

    toJSON(): CommandJSON {
        const json: CommandJSON = {
            type: this.type,
            id: this.id,
            name: this.name,
        };

        return json;
    }

    fromJSON(json: CommandJSON): void {
        this.type = json.type;
        this.id = json.id;
        this.name = json.name;
    }

    // eslint-disable-next-line class-methods-use-this
    execute(): void {}

    // eslint-disable-next-line class-methods-use-this
    undo(): void {}

    // eslint-disable-next-line class-methods-use-this
    test(): boolean {
        return true;
    }
}
