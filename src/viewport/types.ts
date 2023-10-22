import type { Test } from '../core/types';
import type { EditorPointer } from '../editor/types';
import type { Optimizer } from '../optimizer/Optimizer';
import type { Renderer } from '../renderer/types';

export type Viewport = {
    renderer: Renderer;

    optimizer: Optimizer;
    /**
     * Method triggered by `windowResize` signal.
     */
    resize: () => void;
    /**
     * Call this on every frame to update the debugger.
     * @param delta
     */
    update: (delta: number) => void;
} & EditorPointer &
    Test;
