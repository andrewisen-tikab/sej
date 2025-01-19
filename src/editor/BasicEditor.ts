import { BasicStorage } from '../storage/BasicStorage';
import { MobileUtils } from '../utils/MobileUtils';
import { AbstractEditor, EditorParams } from './AbstractEditor';
import { Config } from './Config';

/**
 * The `BasicEditor` class extends the `AbstractEditor` class.
 * This class provides basic editing functionalities.
 *
 * @remarks
 * This is a basic implementation of an editor and can be extended
 * to add more advanced features.
 *
 * @example
 * Here's an example of how to use the `BasicEditor`:
 * ```typescript
 * const editor = new BasicEditor();
 * editor.open();
 * ```
 */
export class BasicEditor extends AbstractEditor {
    constructor(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        params: EditorParams = {},
    ) {
        super(params);

        this.mobileUtils = MobileUtils;
        this.storage = params.storage ?? new BasicStorage();

        this.config = new Config();
    }
}
