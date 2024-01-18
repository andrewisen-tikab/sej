import { AbstractCommand } from './AbstractCommand';

type Command = typeof AbstractCommand;
/**
 * Available commands.
 */
class AvailableCommands {
    commands: Record<string, Command> = {};

    /**
     * Register command.
     * @param command Command to register.
     */
    public register(command: Command): void {
        this.commands[command.name] = command;
    }

    // /**
    //  * Get command by type.
    //  * @param type Command type.
    //  * @returns Command.
    //  */
    get(type: string): Command | undefined {
        return this.commands[type];
    }
}

export const availableCommands = new AvailableCommands();
