/**
 * Base type for all commands.
 */
export type CommandBase = {
    type: string;
    id: number;
    name: string;
};

/**
 * Base class for all commands.
 */
export default class Command implements CommandBase {
    public id: number;
    public inMemory: boolean;
    public updatable: boolean;

    /**
     * The type of command.
     */
    public type: string;
    /**
     * Human readable name of the command.
     */
    public name: string;
    /**
     * The command as JSON.
     */
    public json: CommandBase | undefined;

    /**
     * Setup the command.
     */
    constructor() {
        this.id = -1;
        this.inMemory = false;
        this.updatable = false;
        this.type = '';
        this.name = '';
    }

    /**
     * Convert the command to JSON.
     * @returns The command as JSON.
     */
    toJSON(): CommandBase {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
        };
    }

    /**
     * Convert the command from JSON.
     */
    fromJSON(json: CommandBase): void {
        this.inMemory = true;
        this.type = json.type;
        this.id = json.id;
        this.name = json.name;
    }

    execute() {
        throw new Error('Method not implemented.');
    }

    update() {
        throw new Error('Method not implemented.');
    }

    undo() {
        throw new Error('Method not implemented.');
    }

    redo() {
        throw new Error('Method not implemented.');
    }
}
