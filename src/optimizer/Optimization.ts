/* eslint-disable @typescript-eslint/no-unused-vars, class-methods-use-this */
import type { Optimizer } from './Optimizer';

/**
 * Credit: [https://github.com/gkjohnson/js-framerate-optimizer](https://github.com/gkjohnson/js-framerate-optimizer)
 *
 * An optimization base class for creating a reusable optimization to add to the Optimizer.
 */
export class Optimization {
    /**
     * The optimize function is called whenever an optimization should take place,
     * either to improve performance or quality.
     * The `delta` argument is the amount of milliseconds difference between the target framerate and the current framerate.
     * A negative value means that less work should be done to hit the target.
     *
     * The optimize function must return true if the setting was optimized and 'false' if no optimization could occur, ie the setting being optimized could not be turned down any further or is at the lowest acceptable setting.
     * The second argument `optimizer` is the optimizer that is running the optimization.
     * @param delta
     * @param _optimizer
     * @returns
     */
    optimize(_delta: number, _optimizer: Optimizer) {
        return true;
    }
}
