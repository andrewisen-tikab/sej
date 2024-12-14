import { describe, expect, it } from 'vitest';

import { TestEditor } from './TestEditor';

describe('editor/TestEditor', () => {
    it('should create an instance of TestEditor', () => {
        const editor = new TestEditor();
        expect(editor).toBeInstanceOf(TestEditor);
    });

    // Add more tests as needed
});
