import type { AddDebug } from '../debugger/types';

export type MathOperation = 'round' | 'ceil' | 'floor';

export type SpatialHashGrid = {
    isSpatialHashGrid: boolean;
    getCellNear(x: number, y: number, mathOperation?: MathOperation): [number, number];
} & AddDebug;
