import type { Command, CommandJSON } from '../commands/types';
import type { Test } from '../core/types';
import { EditorPointer } from '../editor/types';

export type History = {
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
} & EditorPointer &
    Test;

export type HistoryJSON = {
    undos: CommandJSON[];
    redos: CommandJSON[];
};
