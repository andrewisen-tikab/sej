import type { AddDebug } from '../debugger/types';

export type MathOperation = 'round' | 'ceil' | 'floor';

/**
 * The `SpatialHashGrid` is responsible for spatial partitioning.
 * It can be used to keep track of objects in a scene when performance is a concern.
 *
 * For example, it allows for quick lookup of objects in a very large scene.
 *
 * However, for simpler apps - disabling this feature is recommended.
 */
export type SpatialHashGrid = {
    isSpatialHashGrid: boolean;
    getCellNear(x: number, y: number, mathOperation?: MathOperation): [number, number];
    getBox(): THREE.Box3;
} & AddDebug;
