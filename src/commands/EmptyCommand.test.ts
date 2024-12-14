import { describe, expect, it } from 'vitest';

import { AbstractEditor } from '../editor/AbstractEditor';
import { AbstractCommand } from './AbstractCommand';
import { EmptyCommand } from './EmptyCommand';

const dummyEditor = {} as AbstractEditor;

describe('commands/EmptyCommand', () => {
    it('should create an instance of EmptyCommand', () => {
        const command = new EmptyCommand(dummyEditor);
        expect(command).toBeInstanceOf(EmptyCommand);
    });

    it('should extend AbstractCommand', () => {
        const command = new EmptyCommand(dummyEditor);
        expect(command).toBeInstanceOf(AbstractCommand);
    });

    it('should serialize to JSON', () => {
        const command = new EmptyCommand(dummyEditor);
        const json = command.toJSON();

        expect(json).toEqual({
            type: '',
            id: -1,
            name: '',
        });
    });

    it('should deserialize from JSON', () => {
        const command = new EmptyCommand(dummyEditor);
        const json = {
            type: 'test',
            id: 1,
            name: 'Test',
        };

        command.fromJSON(json);
        expect(command.type).toBe(json.type);
        expect(command.id).toBe(json.id);
        expect(command.name).toBe(json.name);
    });

    it('should have an execute method', () => {
        const command = new EmptyCommand(dummyEditor);
        expect(command.execute).toBeDefined();
    });

    it('should have an undo method', () => {
        const command = new EmptyCommand(dummyEditor);
        expect(command.undo).toBeDefined();
    });
});
