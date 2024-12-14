import { AbstractEditor } from './AbstractEditor';

/**
 * The `TestEditor` class extends the `AbstractEditor` class.
 * This class is intended to provide specific editor functionalities
 * for testing purposes.
 *
 * @remarks
 * This will **NOT** render anything to the screen.
 * This is only used in testing environments.
 *
 * @example
 * Here's a basic example of how to use the `TestEditor` class:
 * ```typescript
 * const editor = new TestEditor();
 * editor.someMethod();
 * ```
 */
export class TestEditor extends AbstractEditor {}
