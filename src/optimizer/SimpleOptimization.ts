/* eslint-disable @typescript-eslint/no-unused-vars, class-methods-use-this  */
import { Optimization } from './Optimization';

/**
 * A extension of {@link Optimization} that abstracts some of the basic functionality needed to implement it.
 */
export class SimpleOptimization extends Optimization {
    /**
     * Functions that should return true if the optimizer can increase or decrease work.
     * If they return true the associated optimization function will be called.
     */
    canIncreaseWork() {
        return true;
    }

    /**
     * Functions to increase or decrease work and optimize the frame if needed.
     * These are called if the associated `canIncreaseWork` or `canDecreaseWork` return true.
     * @param _delta
     */
    increaseWork(_delta: number) {}

    /**
     * Functions that should return true if the optimizer can increase or decrease work.
     * If they return true the associated optimization function will be called.
     */
    canDecreaseWork() {
        return true;
    }

    /**
     * Functions to increase or decrease work and optimize the frame if needed.
     * These are called if the associated `canIncreaseWork` or `canDecreaseWork` return true.
     * @param _delta
     */
    decreaseWork(_delta: number) {}

    optimize(delta: number) {
        if (delta < 0) {
            if (this.canDecreaseWork()) {
                this.decreaseWork(delta);
                return true;
            }
        } else if (this.canIncreaseWork()) {
            this.increaseWork(delta);
            return true;
        }

        return false;
    }
}
