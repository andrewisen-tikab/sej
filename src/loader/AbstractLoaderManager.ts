import * as THREE from 'three';

import { ErrorObject } from '@andrewisen/error-manager';

import { ErrorManager, Errors } from '../core/ErrorManager';
import { LoaderUtils } from './LoaderUtils';
import type { File, FileMap, Item, LoaderManager, Loaders } from './types';

/**
 * Abstract class for all loaders.
 */
export class AbstractLoaderManager implements LoaderManager {
    texturePath: string;

    loaders: Loaders;

    manager: THREE.LoadingManager;

    constructor() {
        this.texturePath = '';
        this.loaders = {};
        this.manager = new THREE.LoadingManager();
    }

    loadItemList(items: Item[]): void {
        LoaderUtils.getFilesFromItemList(items, (files, filesMap) => {
            this.loadFiles(files, filesMap);
        });
    }

    loadFiles(files: File[], map?: FileMap): void {
        if (files.length === 0) return;
        const filesMap = map || LoaderUtils.createFilesMap(files);

        const manager = new THREE.LoadingManager();
        manager.setURLModifier((url) => {
            const cleanURL = url.replace(/^(\.?\/)/, ''); // remove './'

            const file = filesMap[url];

            if (file) {
                // eslint-disable-next-line no-console
                console.log('Loading', cleanURL);
                return URL.createObjectURL(file);
            }

            return url;
        });

        for (let i = 0; i < files.length; i++) {
            this.loadFile(files[i], manager);
        }
    }

    async loadFile(file: File, manager?: THREE.LoadingManager): Promise<void> {
        const filename = file.name;
        const extension = filename.split('.').pop().toLowerCase();

        const reader = new FileReader();
        reader.addEventListener('progress', (event) => {
            const size = `(${Math.floor(event.total / 1000)} KB)`;
            const progress = `${Math.floor((event.loaded / event.total) * 100)}%`;

            // eslint-disable-next-line no-console
            console.log('Loading', filename, size, progress);
        });

        const loader = this.loaders[extension];

        if (loader == null) {
            throw await ErrorManager.error(
                new ErrorObject(
                    Errors.LOADER_MANAGER_LOADER_NOT_FOUND.key,
                    Errors.LOADER_MANAGER_LOADER_NOT_FOUND.message(extension),
                ),
            );
        }

        loader.load(reader, file, filename, manager ?? this.manager);
    }
}
