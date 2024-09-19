import type { Command, CommandJSON } from '../commands/types';
import type { Test } from '../core/types';
import { EditorPointer } from '../editor/types';

export type History = {
    /**
     * Array of {@link Command | commands} that have been executed.
     */
    undos: Command[];
    /**
     * Array of {@link Command | commands} that have been undone.
     */
    redos: Command[];
    /**
     * Execute a {@link Command}.
     * @param command {@link Command} to be executed
     * @param optionalName Optional name of the command
     */
    execute: (command: Command, optionalName?: string) => void;
    /**
     * Undo the last executed {@link Command | command}
     */
    undo: () => Command | undefined;
    /**
     * Redo the last executed {@link Command | command}
     */
    redo: () => void;
    /**
     * Go to a specific state in the history.
     * @param id State id to go to
     */
    goToState(id: number): void;
    /**
     * Enables serialization of commands in the history stack.
     *
     * This method ensures that all commands in the undo and redo stacks
     * are serialized by invoking their `toJSON` method. It temporarily
     * disables the `sceneGraphChanged` and `historyChanged` signals to
     * prevent unnecessary updates during the serialization process.
     *
     * @param id - The state ID to which the history should be restored after serialization.
     */
    enableSerialization(id: number): void;
    fromJSON(json: HistoryJSON): void;
    toJSON(): HistoryJSON;
} & EditorPointer &
    Test;

export type HistoryJSON = {
    undos: CommandJSON[];
    redos: CommandJSON[];
};
