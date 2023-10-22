import * as THREE from 'three';

import type { Test } from '../core/types';
import type { EditorPointer } from '../editor/types';

export type Selector = {
    /**
     * Select an {@link Object3D | object}.
     * @param object {@link Object3D | object} to be selected
     */
    select: (object: THREE.Object3D | null) => void;
    /**
     * Deselect the selected {@link Object3D | object}.
     */
    deselect: () => void;
} & EditorPointer &
    Test;
