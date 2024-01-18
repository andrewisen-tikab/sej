import type { Editor } from '../editor/types';
import { AbstractCommand } from './AbstractCommand';
import type { CommandJSON } from './types';
import { availableCommands } from './utils';

export type MultiCommandsCommandJSON = CommandJSON & {
    commands: CommandJSON[];
};

/**
 * Multi Commands command.
 */
export class MultiCommandsCommand extends AbstractCommand {
    /**
     * Commands to execute.
     */
    public commands: AbstractCommand[];

    /**
     * Execute commands.
     * @param editor Pointer to {@link Editor}.
     * @param commands Commands to execute.
     */
    constructor(editor: Editor, commands: AbstractCommand[] = []) {
        super(editor);

        this.type = 'MultiCommandsCommand';
        this.name = 'Multiple Changes';

        this.commands = commands;
    }

    execute(): void {
        this.editor.signals.sceneGraphChanged.active = false;

        for (let i = 0; i < this.commands.length; i++) {
            this.commands[i].execute();
        }

        this.editor.signals.sceneGraphChanged.active = true;
        this.editor.signals.sceneGraphChanged.dispatch();
    }

    undo(): void {
        this.editor.signals.sceneGraphChanged.active = false;

        for (let i = this.commands.length - 1; i >= 0; i--) {
            this.commands[i].undo();
        }

        this.editor.signals.sceneGraphChanged.active = true;
        this.editor.signals.sceneGraphChanged.dispatch();
    }

    toJSON(): MultiCommandsCommandJSON {
        const output = super.toJSON() as MultiCommandsCommandJSON;

        const commands: CommandJSON[] = [];
        for (let i = 0; i < this.commands.length; i++) {
            commands.push(this.commands[i].toJSON());
        }

        output.commands = commands;

        return output;
    }

    fromJSON(json: MultiCommandsCommandJSON): void {
        super.fromJSON(json);

        const { commands } = json;
        for (let i = 0; i < commands.length; i++) {
            const Command = availableCommands.get(commands[i].type);
            if (Command === undefined) continue;
            const command = new Command(this.editor);
            command.fromJSON(commands[i]);
            this.commands.push(command);
        }
    }

    test() {
        this.execute();
        return true;
    }
}
