import { ErrorManager as E } from '@andrewisen/error-manager';

export const ErrorManager = E.Instance;

/**
 * Errors that can be thrown by the library.
 */
export const Errors = {
    /**
     * The renderer's scene is not an Object3D. It must be an THREE.Object3D.
     */
    RENDERER_NOT_OBJECT_3D: {
        key: 'error-renderer-not-object-3d',
        message: "The renderer's scene is not an Object3D. It must be an THREE.Object3D.",
    },
    /**
     * The renderer's camera is not an Camera. It must be an THREE.PerspectiveCamera or THREE.OrthographicCamera.
     */
    RENDERER_NOT_CAMERA: {
        key: 'error-renderer-not-camera',
        message:
            "The renderer's camera is not an Camera. It must be an THREE.PerspectiveCamera or THREE.OrthographicCamera.",
    },
    /**
     * The renderer's domElement is not an HTMLCanvasElement. It must be an HTMLCanvasElement.
     */
    EDITOR_SELECT_OBJECT_BY_ID_NOT_FOUND: {
        key: 'error-editor-select-object-by-id-not-found',
        message: (id: number) => `The object with id ${id} was not found.`,
    },
    /**
     * The renderer's domElement is not an HTMLCanvasElement. It must be an HTMLCanvasElement.
     */
    LOADER_MANAGER_LOADER_NOT_FOUND: {
        key: 'error-loader-manager-loader-not-found',
        message: (extension: string): string =>
            `The loader for the extension ${extension} was not found.`,
    },
    SELECTOR_OBJECT_NOT_FOUND: {
        key: 'selector-object-not-found',
        message: (uuid: string): string => `Object ${uuid} cannot be selected/deselected.`,
    },
} as const;
