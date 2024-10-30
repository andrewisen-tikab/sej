import type { SerializableObject, Test } from '../core/types';
import type { EditorPointer } from '../editor/types';

export type Command = {
    /**
     * Unique id of the command
     */
    id: number;
    /**
     * Whether the command is in memory.
     */
    inMemory: boolean;
    /**
     * Whether the command is updatable.
     *
     * If the command is **NOT** updatable, it's added as a new part of the history
     */
    updatable: boolean;
    /**
     * Type of the command
     */
    type: string;
    /**
     * Human readable name of the command
     */
    name: string;
    /**
     * Execute the command, if possible.
     * @returns If the command is executed successfully, return `void`. Otherwise, throw an error.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute(...args: any[]): void | never;
    /**
     * Undo the command.
     * @returns If the command is executed successfully, return `void`. Otherwise, throw an error.
     */
    undo(): void | never;
    json: CommandJSON | undefined;
} & EditorPointer &
    SerializableObject &
    Test;

export type CommandJSON = Pick<Command, 'type' | 'id' | 'name'>;
