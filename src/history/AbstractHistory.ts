import { AbstractCommand } from '../commands/AbstractCommand';
import type { Command } from '../commands/types';
import type { Config } from '../editor/Config';
import type { Editor } from '../editor/types';
import { History, HistoryJSON } from './types';

/**
 * Abstract class for all history implementations.
 */
export class AbstractHistory implements History {
    public editor: Editor;

    public undos: Command[];

    public redos: Command[];

    public lastCmdTime: number;

    public idCounter: number;

    public historyDisabled: boolean;

    config: Config;

    /**
     * The time difference limit between two commands to be considered as a single command.
     * @default 500
     */
    public timeDifferenceLimit: number;

    constructor(editor: Editor) {
        this.editor = editor;
        this.undos = [];
        this.redos = [];
        this.lastCmdTime = Date.now();
        this.idCounter = 0;
        this.timeDifferenceLimit = 500;

        this.historyDisabled = false;
        this.config = editor.config;
    }

    execute(cmd: Command, optionalName?: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lastCmd = this.undos[this.undos.length - 1] as any;
        const timeDifference = Date.now() - this.lastCmdTime;

        // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, @typescript-eslint/no-explicit-any
        const _cmd = cmd as any;
        const isUpdatableCmd =
            lastCmd &&
            lastCmd.updatable &&
            cmd.updatable &&
            lastCmd.object === _cmd.object &&
            lastCmd.type === _cmd.type &&
            lastCmd.script === _cmd.script &&
            lastCmd.attributeName === _cmd.attributeName;

        if (isUpdatableCmd && timeDifference < this.timeDifferenceLimit) {
            lastCmd.update(cmd);
            // eslint-disable-next-line no-param-reassign
            cmd = lastCmd; // Warning: Mutation!
        } else {
            // the command is not updatable and is added as a new part of the history
            this.undos.push(cmd);

            // eslint-disable-next-line no-param-reassign
            cmd.id = ++this.idCounter; // Warning: Mutation!
        }

        // eslint-disable-next-line no-param-reassign
        cmd.name = optionalName !== undefined ? optionalName : cmd.name; // Warning: Mutation!
        cmd.execute();
        // eslint-disable-next-line no-param-reassign
        cmd.inMemory = true; // Warning: Mutation!

        // eslint-disable-next-line no-param-reassign
        if (this.config.getKey('settings/history')) cmd.json = cmd.toJSON(); // serialize the cmd immediately after execution and append the json to the cmd

        this.lastCmdTime = Date.now();

        // clearing all the redo-commands
        this.redos = [];
        this.editor.signals.historyChanged.dispatch(cmd);
    }

    undo(): Command | undefined {
        if (this.historyDisabled) return undefined;

        let cmd: Command | undefined;

        if (this.undos.length > 0) {
            cmd = this.undos.pop();
            if (cmd && cmd.inMemory === false) cmd.fromJSON(cmd.json);
        }

        if (cmd !== undefined) {
            cmd.undo();
            this.redos.push(cmd);
            this.editor.signals.historyChanged.dispatch(cmd);
        }

        return cmd;
    }

    redo(): Command | undefined {
        if (this.historyDisabled) return undefined;

        let cmd: Command | undefined;

        if (this.redos.length > 0) {
            cmd = this.redos.pop();

            if (cmd && cmd.inMemory === false) cmd.fromJSON(cmd.json);
        }

        if (cmd !== undefined) {
            cmd.execute();
            this.undos.push(cmd);
            this.editor.signals.historyChanged.dispatch(cmd);
        }

        return cmd;
    }

    toJSON() {
        const history: HistoryJSON = {
            undos: [],
            redos: [],
        };

        if (!this.config.getKey('settings/history')) {
            return history;
        }

        // Append Undos to History
        for (let i = 0; i < this.undos.length; i++)
            // eslint-disable-next-line no-prototype-builtins
            if (this.undos[i].hasOwnProperty('json')) history.undos.push(this.undos[i].json!);

        // Append Redos to History
        for (let i = 0; i < this.redos.length; i++)
            // eslint-disable-next-line no-prototype-builtins
            if (this.redos[i].hasOwnProperty('json')) history.redos.push(this.redos[i].json!);

        return history;
    }

    fromJSON(json: HistoryJSON) {
        if (json === undefined) return;

        // Select the last executed undo-command
        this.editor.signals.historyChanged.dispatch(this.undos[this.undos.length - 1]);
    }

    clear() {
        this.undos = [];
        this.redos = [];
        this.idCounter = 0;

        this.editor.signals.historyChanged.dispatch();
    }

    goToState(id: number) {
        if (this.historyDisabled) return;

        this.editor.signals.sceneGraphChanged.active = false;
        this.editor.signals.historyChanged.active = false;

        let cmd = this.undos.length > 0 ? this.undos[this.undos.length - 1] : undefined; // next cmd to pop

        if (cmd === undefined || id > cmd.id) {
            cmd = this.redo();
            while (cmd !== undefined && id > cmd.id) {
                cmd = this.redo();
            }
        } else {
            while (true) {
                cmd = this.undos[this.undos.length - 1]; // next cmd to pop

                if (cmd === undefined || id === cmd.id) break;

                this.undo();
            }
        }

        this.editor.signals.sceneGraphChanged.active = true;
        this.editor.signals.historyChanged.active = true;

        this.editor.signals.sceneGraphChanged.dispatch();
        this.editor.signals.historyChanged.dispatch(cmd);
    }

    // eslint-disable-next-line class-methods-use-this
    test(): boolean {
        const { editor } = this;
        const history = new AbstractHistory(editor);
        const command = new AbstractCommand(editor);

        history.execute(command);
        if (history.undos.length !== 1) return false;

        history.undo();
        if (history.undos.length === 1) return false;

        history.redo();
        if (history.undos.length !== 1) return false;

        return true;
    }
}
