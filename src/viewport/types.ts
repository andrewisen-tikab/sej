import type { Test } from '../core/types';
import type { EditorPointer } from '../editor/types';
import type { Optimizer } from '../optimizer/Optimizer';
import type { Renderer } from '../renderer/types';

/**
 * The `viewport` is class that handles the rendering of the scene.
 * It's a high-level abstraction of the {@link Renderer}.
 */
export type Viewport = {
    /**
     * The renderer used to render the scene.
     */
    renderer: Renderer;
    /**
     * The optimizer used to optimize rendering.
     */
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
