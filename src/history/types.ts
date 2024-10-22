import type { AbstractCommand } from '../Sej';
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
     * Add a {@link Command} that `fromJSON` can use.
     */
    addSerializableCommand: (command: typeof AbstractCommand) => void;
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
     * Clears the history by resetting the undo and redo stacks and the ID counter.
     * Also dispatches a signal indicating that the history has changed.
     */
    clear: () => void;
    /**
     * Clears the redo stack and dispatches a history changed signal.
     *
     * @remarks
     * This method resets the `redos` array to an empty state and notifies
     * the editor that the history has changed by dispatching the `historyChanged` signal.
     */
    clearRedos: () => void;
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

    /**
     * Populates the history state from a JSON object.
     *
     * @param json - The JSON object containing the history data.
     *
     * The method processes the `undos` and `redos` arrays from the JSON object,
     * creating command instances and populating the respective history stacks.
     * It also updates the `idCounter` to the highest command ID found in the JSON data.
     *
     * If a command cannot be created from the JSON data, an error is logged to the console.
     *
     * Finally, it dispatches a `historyChanged` signal with the last executed undo-command.
     */
    fromJSON(json: HistoryJSON): void;
    /**
     * Converts the current history state to a JSON object.
     *
     * @returns {HistoryJSON} The JSON representation of the history, including undos and redos.
     *                        If the 'settings/history' configuration key is not set, returns an empty history.
     */
    toJSON(): HistoryJSON;
} & EditorPointer &
    Test;

export type HistoryJSON = {
    undos: CommandJSON[];
    redos: CommandJSON[];
};
