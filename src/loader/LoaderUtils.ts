import type { File, FileMap, Item } from './types';

/**
 * Utility functions for loaders.
 */
export const LoaderUtils = {
    /**
     * Create a map of files.
     * @param files Files to create the map from.
     * @returns A {@link FileMap | file map}
     */
    createFilesMap: (files: File): FileMap => {
        const map: FileMap = {};

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            map[file.name] = file;
        }

        return map;
    },

    /**
     * Get files from a list of {@link Item | items}.
     * @param items {@link Item | Items} to get the files from.
     * @param onDone Callback called when the files are retrieved.
     */
    getFilesFromItemList: (items: Item[], onDone: (files: File[], filesMap: FileMap) => void) => {
        let itemsCount = 0;
        let itemsTotal = 0;

        const files: File[] = [];
        const filesMap: FileMap = {};

        /**
         * Called when an entry is handled.
         */
        const onEntryHandled = () => {
            itemsCount++;

            if (itemsCount === itemsTotal) {
                onDone(files, filesMap);
            }
        };

        /**
         * If the item described by the DataTransferItem is a file,
         * webkitGetAsEntry() returns a FileSystemFileEntry or FileSystemDirectoryEntry representing it.
         *
         * If the item isn't a file, null is returned.
         * @param entry
         */
        const handleEntry = (entry: FileSystemEntry | null) => {
            if (entry === null) return;
            if (entry.isDirectory) {
                const reader = (entry as FileSystemDirectoryEntry).createReader();
                reader.readEntries((entries) => {
                    for (let i = 0; i < entries.length; i++) handleEntry(entries[i]);
                    onEntryHandled();
                });
            } else if (entry.isFile) {
                (entry as FileSystemFileEntry).file((file) => {
                    files.push(file);
                    filesMap[entry.fullPath.slice(1)] = file;
                    onEntryHandled();
                });
            }

            itemsTotal++;
        };

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.kind === 'file') handleEntry(item.webkitGetAsEntry());
        }
    },
};
