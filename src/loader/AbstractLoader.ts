/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable class-methods-use-this */
import { LoadingManager } from 'three';

import { Editor } from '../editor/types';
import { File, Loader } from './types';

/**
 * Abstract class for all loaders.
 */
export class AbstractLoader implements Loader {
    extension: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loader!: any;

    editor: Editor;

    constructor(editor: Editor, extension: string) {
        this.editor = editor;
        this.extension = extension;
    }

    load(_reader: FileReader, _file: File, _filename: string, _manager: LoadingManager): void {}
}
