import * as THREE from 'three';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Item = DataTransferItem;
export type File = any;
export type FileMap = { [key: string]: File };
export type ItemMap = { [key: string]: Item };
/* eslint-enable @typescript-eslint/no-explicit-any */

export type Loader = {
    extension: string;
    /**
     *
     * @param reader
     * @param file
     * @param filename
     * @param manager
     * @returns
     */
    load: (reader: FileReader, file: File, filename: string, manager: THREE.LoadingManager) => void;
};

export type Loaders = {
    [key: string]: Loader;
};

export type LoaderManager = {
    /**
     * The path to the texture folder.
     */
    texturePath: string;
    /**
     * Supported loaders.
     * The key is the extension of the file.
     *
     * E.g. `.obj` => `OBJLoader`
     */
    loaders: Loaders;
    /**
     * Load a list of {@link Item | items}.
     * @param items {@link Item | Items} to loaded.
     */
    loadItemList: (items: Item[]) => void;
    /**
     * Load a list of {@link File | files}.
     * @param files {@link File | Files} to loaded.
     * @param map {@link FileMap | FileMap} to loaded.
     */
    loadFiles: (files: File, map?: FileMap) => void;
    /**
     * Load a {@link File | file}.
     * @param file {@link File | File} to loaded.
     * @param manager {@link THREE.LoadingManager | LoadingManager}
     */
    loadFile: (file: File, manager?: THREE.LoadingManager) => void;
};
