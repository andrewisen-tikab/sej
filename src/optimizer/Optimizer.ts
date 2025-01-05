/* eslint-disable no-param-reassign */
import { Optimization } from './Optimization';
import type { OptimizerOptions } from './types';

/**
 * The optimizer tracks the amount of time spent between frames or between calls
 * to begin and end and calculates the difference between the target amount of time to spend
 * and the actual time spent on the last frame.
 *
 * After the specified amount of time has passed the average time spent is calculated and
 * the framerate the amount of work is either increased or decreased depending
 * on whether or not the time spent was above or below the target.
 *
 * The amount of work is adjusted by iteratively calling prioritized optimizations
 * and sampling framerate until the target work time is met.
 */
export class Optimizer {
    /**
     * Whether to enable or disable he optimizer.
     */
    private _enabled: boolean;

    /**
     * Whether or not the optimizer has stopped iterating and sampling the framerate.
     */
    public completed: boolean;

    /**
     * See {@link OptimizerOptions} for more information.
     */
    public options: OptimizerOptions;

    private _increasingWork: boolean;

    /**
     * A dictionary where the key is a number representing an optimization level
     * and the value is an array of `Optimization` objects associated with that level.
     */
    public optimizations: { [key: number]: Optimization[] };

    /**
     * The minimum priority level for the optimizer.
     * This value determines the lowest priority task that the optimizer will consider.
     */
    public minPriority: number;

    public maxPriority: number;

    /**
     * The number of frames that have been waited.
     * This property keeps track of how many frames have passed while waiting for a certain condition or event.
     */
    public waitedFrames: number;

    /**
     * The number of milliseconds that the optimizer has waited.
     * This value is used to track the waiting time for certain operations.
     */
    public waitedMillis: number;

    /**
     * The number of frames that have elapsed since the start of the optimization process.
     */
    public elapsedFrames: number;

    /**
     * The amount of time that has elapsed, in milliseconds.
     */
    public elapsedTime: number;

    /**
     * The timestamp indicating when the optimization process begins.
     * Represented as the number of milliseconds elapsed since the UNIX epoch.
     */
    public beginTime: number;

    /**
     * The current priority level of the optimizer.
     * This can be a number representing the priority or null if no priority is set.
     */
    public currPriority: number | null;

    /**
     * The current optimization level or state.
     * This value represents the current stage or level of optimization being applied.
     */
    public currOptimization: number;

    /**
     * Indicates whether the window is currently focused.
     *
     * @private
     */
    private _windowFocused: boolean;

    /**
     * A function that handles the window blur event.
     *
     * @private
     * @type {() => boolean}
     */
    private _windowBlurFunc: () => boolean;

    /**
     * A function that gets called when the window gains focus.
     * This function does not take any parameters and does not return any value.
     */
    private _windowFocusFunc: () => void;

    /**
     * Getter and setter for enabling or disabling the optimizer.
     * Elapsed time is reset on reenable.
     */
    get enabled() {
        return this._enabled;
    }

    /**
     * Getter and setter for enabling or disabling the optimizer.
     * Elapsed time is reset on reenable.
     */
    set enabled(val) {
        if (this._enabled !== val) {
            this._resetCheck();
        }

        this._enabled = val;
    }

    /**
     * All options can be accessed and modified on Optimizer.options.
     * @param options
     */
    constructor(_options?: Partial<OptimizerOptions>) {
        const options: OptimizerOptions = {
            targetMillis: 1000 / 60,
            targetFramerate: null,
            interval: 500,
            maxFrameSamples: Infinity,
            waitMillis: 0,
            maxWaitFrames: Infinity,
            margin: 0.05,
            continuallyRefine: false,
            increaseWork: false,
            ..._options,
        };

        // convert the specified framerate option to millis
        if (options.targetFramerate && options.targetFramerate > 0) {
            options.targetMillis = 1000 / options.targetFramerate;
            options.targetFramerate = null;
        }

        /* eslint-disable require-jsdoc */
        Object.defineProperty(options, 'targetFramerate', {
            get() {
                return 1000 / this.targetMillis;
            },
            set(v) {
                this.targetMillis = 1000 / v;
            },
        });
        /* eslint-enable require-jsdoc */

        this.options = options;

        this._enabled = true;
        this.completed = false;
        this._increasingWork = this.options.increaseWork;

        // the prioritized optimizations -- int : array
        // It would be best if this were sorted linked list so
        // large gaps don't cause unnecessary iteration
        this.optimizations = {};
        this.minPriority = Infinity;
        this.maxPriority = -Infinity;

        // Tracking the time between optimizations
        this.waitedFrames = this.options.maxWaitFrames;
        this.waitedMillis = this.options.waitMillis;
        this.elapsedFrames = 0;
        this.elapsedTime = 0;
        this.beginTime = -1;

        // The next optimization to try
        this.currPriority = null;
        this.currOptimization = 0;

        this._windowFocused = true;
        // eslint-disable-next-line no-return-assign
        this._windowBlurFunc = () => (this._windowFocused = false);
        this._windowFocusFunc = () => {
            this._windowFocused = true;
            this._resetCheck();
        };
        window.addEventListener('blur', this._windowBlurFunc);
        window.addEventListener('focus', this._windowFocusFunc);
    }

    /**
     * Disposes of the optimizer by removing event listeners for window blur and focus events.
     * This helps to clean up resources and prevent memory leaks when the optimizer is no longer needed.
     */
    public dispose(): void {
        window.removeEventListener('blur', this._windowBlurFunc);
        window.removeEventListener('focus', this._windowFocusFunc);
    }

    /**
     * Restarts the optimizer by resetting its state.
     *
     * This method performs the following actions:
     * - Resets any checks by calling `resetCheck()`.
     * - Sets the `_increasingWork` property to the value of `options.increaseWork`.
     * - Sets `currPriority` to `null`.
     * - Resets `currOptimization` to `0`.
     * - Marks the optimizer as not completed by setting `completed` to `false`.
     */
    public restart(): void {
        this._resetCheck();

        this._increasingWork = this.options.increaseWork;
        this.currPriority = null;
        this.currOptimization = 0;
        this.completed = false;
    }

    /**
     * Adds a sample time to the optimizer and performs optimization logic.
     *
     * @param sampleTime - The time of the sample to add, in milliseconds.
     *
     * This method performs the following steps:
     * 1. Checks if the optimizer is enabled, the window is focused, and the optimization is not completed.
     * 2. Waits for the required number of frames and milliseconds between calls.
     * 3. Increments the elapsed time and frame count.
     * 4. If the elapsed time or frame count exceeds the specified interval or maximum frame samples, it calculates the average frame time and determines if optimization is needed.
     * 5. Depending on whether the optimizer is currently increasing or decreasing work, it adjusts the priority and performs optimization iterations.
     * 6. Resets the elapsed time and frame count, and sets the wait time for the next call.
     */
    public addSample(sampleTime: number): void {
        // if we're not active for any reason, continue
        if (!this._enabled || !this._windowFocused || this.completed) return;

        // wait the required number of frames between calls
        if (this.waitedFrames !== 0 && this.waitedMillis !== 0) {
            this.waitedMillis -= sampleTime;
            this.waitedFrames--;

            this.waitedFrames = Math.max(this.waitedFrames, 0);
            this.waitedMillis = Math.max(this.waitedMillis, 0);
            return;
        }

        // increment the time and frames run
        this.elapsedTime += sampleTime;
        this.elapsedFrames++;

        // if we've waited for an appropriate amount of time
        if (
            this.elapsedTime >= this.options.interval ||
            this.elapsedFrames >= this.options.maxFrameSamples
        ) {
            // average time per frame and the differences
            const frameTime = this.elapsedTime / this.elapsedFrames;
            const delta = this.options.targetMillis - frameTime;
            const ratio = delta / this.options.targetMillis;
            const isOutsideMargin = Math.abs(ratio) > this.options.margin;
            const needsImproving = delta < 0 && isOutsideMargin;

            if (this._increasingWork) {
                if (this.currPriority === null) {
                    this.currPriority = this.minPriority;
                }

                // If our frame time is higher than we want, then
                // start trying to improve it.
                if (needsImproving) {
                    this._increasingWork = false;
                    this.currPriority = this.maxPriority;
                    this.currOptimization = 0;
                } else {
                    // delta will always be ~0 when targeting 60 fps because the
                    // browser runs at a fixed framerate
                    this._iterate(Math.max(delta, 1));
                }
            }

            // Try to improve the frame time
            if (!this._increasingWork) {
                if (this.currPriority === null) {
                    this.currPriority = this.maxPriority;
                }

                let didOptimize = false;

                if (needsImproving) {
                    didOptimize = this._iterate(delta);
                }

                if (!didOptimize) {
                    if (this.options.continuallyRefine) {
                        this._increasingWork = true;
                    } else {
                        this.completed = true;
                    }
                }
            }

            this.elapsedFrames = 0;
            this.elapsedTime = 0;
            this.waitedFrames = this.options.maxWaitFrames;
            this.waitedMillis = this.options.waitMillis;
        }
    }

    /**
     * Records the current time as the start time for an operation.
     * This method uses the `window.performance.now()` function to get a high-resolution timestamp.
     */
    private _begin(): void {
        this.beginTime = window.performance.now();
    }

    /**
     * Ends the current timing iteration and records the elapsed time since `begin` was called.
     * If `end` is called before `begin`, the method will return immediately without recording any time.
     *
     * @remarks
     * This method calculates the time elapsed since `begin` was called using `window.performance.now()`
     * and adds the sample to the collection of recorded times.
     */
    private _end(): void {
        // If end is called before begin then skip this iteration
        if (this.beginTime === -1) return;

        const timeFromBegin = window.performance.now() - this.beginTime;
        this.addSample(timeFromBegin);
    }

    /**
     * Updates the optimizer by ending the current process and beginning a new one.
     * This method ensures that any ongoing operations are properly terminated
     * before starting a new operation cycle.
     */
    public update(): void {
        this._end();
        this._begin();
    }

    /**
     * Adds an optimization to the optimizer with an optional priority.
     *
     * @param optimization - The optimization to add. Can be an instance of `Optimization` or a function.
     * @param priority - The priority of the optimization. Defaults to 0 if not provided.
     *
     * If the `optimization` parameter is a function, it will be wrapped in an `Optimization` instance.
     * The priority is parsed as an integer and defaults to 0 if parsing fails.
     * The optimization is then added to the internal optimizations list at the specified priority.
     * The `minPriority` and `maxPriority` properties are updated accordingly.
     */
    public addOptimization(optimization: Optimization, priority = 0): void {
        if (typeof optimization === 'function') {
            const optimizationFunc = optimization;
            optimization = new Optimization();
            optimization.optimize = optimizationFunc;
        }

        priority = parseInt(priority as unknown as string, 10) || 0;
        this.optimizations[priority] = this.optimizations[priority] || [];
        this.optimizations[priority].push(optimization);

        this.minPriority = Math.min(this.minPriority, priority);
        this.maxPriority = Math.max(this.maxPriority, priority);
    }

    /**
     * Iterates through the optimization process, adjusting the current priority level
     * and applying optimizations to improve performance.
     *
     * @param delta - The change in priority level. Positive values increase the priority,
     *                while negative values decrease it.
     * @returns A boolean indicating whether an optimization was successfully applied.
     *
     * The method works by iterating through the current priority level's optimizations.
     * If an optimization is successfully applied, the iteration stops. If no optimizations
     * are applied at the current priority level, the priority level is adjusted by the delta
     * value, and the process continues until the priority level is out of bounds.
     *
     * If an optimization function does not return a boolean value, a warning is logged
     * and the return value is coerced to a boolean.
     */
    private _iterate(delta: number): boolean {
        let done = false;
        while (this.currPriority! <= this.maxPriority && this.currPriority! >= this.minPriority) {
            // search for a optimization we can perform to improve performance
            // if we get through all optimizations without an improvement then
            // move on to the next priority level.
            const optimizations = this.optimizations[this.currPriority!];
            if (optimizations) {
                for (let i = 0; !done && i < optimizations.length; i++) {
                    done = optimizations[this.currOptimization].optimize(delta, this);

                    if (typeof done !== 'boolean') {
                        done = !!done;
                        // eslint-disable-next-line no-console
                        console.warn(
                            'Optimizer: Optimization function not returning a boolean value.',
                        );
                    }

                    this.currOptimization = (this.currOptimization + 1) % optimizations.length;
                }
            }

            if (done) {
                break;
            } else {
                // Lower priority numbers are more important
                this.currPriority! += delta > 0 ? 1 : -1;
                this.currOptimization = 0;
            }
        }

        return done;
    }

    /**
     * Resets the internal tracking variables for the optimizer.
     *
     * This method sets the following properties to their initial values:
     * - `elapsedFrames`: Number of frames that have elapsed since the last reset.
     * - `elapsedTime`: Total time that has elapsed since the last reset.
     * - `waitedFrames`: Number of frames to wait before performing the next optimization, based on `options.maxWaitFrames`.
     * - `waitedMillis`: Number of milliseconds to wait before performing the next optimization, based on `options.waitMillis`.
     * - `beginTime`: The start time for the current optimization cycle, set to -1 to indicate it hasn't started yet.
     */
    private _resetCheck(): void {
        this.elapsedFrames = 0;
        this.elapsedTime = 0;
        this.waitedFrames = this.options.maxWaitFrames;
        this.waitedMillis = this.options.waitMillis;
        this.beginTime = -1;
    }
}
