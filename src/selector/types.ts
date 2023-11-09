import * as THREE from 'three';

import type { Test } from '../core/types';
import type { EditorPointer } from '../editor/types';

/**
 * The `Selector` is responsible for selecting and deselecting objects.
 */
export type Selector = {
    /**
     * Select an {@link Object3D | object}.
     * @param object {@link Object3D | object} to be selected
     */
    select: (object: THREE.Object3D) => void;
    /**
     * Deselect the selected {@link Object3D | object}.
     * @param object {@link Object3D | object} to be selected
     */
    deselect: (object?: THREE.Object3D) => void;
} & EditorPointer &
    Test;
