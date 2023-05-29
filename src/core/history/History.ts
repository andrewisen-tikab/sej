import Command from '../commands/Command';

/**
 * History manager.
 */
export default class History {
    undos: Command[];
    redos: Command[];
    lastCmdTime: number;
    idCounter: number;
    historyDisabled: boolean;
    config: any;
    editor: any;
    constructor() {
        this.undos = [];
        this.redos = [];
        this.lastCmdTime = Date.now();
        this.idCounter = 0;

        this.historyDisabled = false;
    }

    execute(command: Command, optionalName?: string) {
        this.undos.push(command);
        command.id = ++this.idCounter;

        command.name = optionalName !== undefined ? optionalName : command.name;
        command.execute();
        command.inMemory = true;

        command.json = command.toJSON();

        this.lastCmdTime = Date.now();

        this.redos = [];
    }

    clear() {
        this.undos = [];
        this.redos = [];
        this.idCounter = 0;

        this.editor.signals.historyChanged.dispatch();
    }
}
