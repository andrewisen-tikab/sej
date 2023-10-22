export type OptimizerOptions = {
    /**
     * The target milliseconds to hit in the enclosed code block. This cannot be less than 16.66... because browser caps the framerate to 60 frames per second.
     * If this is less than that the optimizer will continually decrease quality to try to get performance up.
     *
     * @default 16.66...
     */
    targetMillis: number;
    /**
     * The target framerate to hit. This overrides targetMillis if it is set.
     * @default null
     */
    targetFramerate: number | null;
    /**
     * How often to perform a check sample the average framerate to try to optimize in milliseconds.
     * @default 500 (half a second)
     */
    interval: number;
    /**
     * At most how many frames can run before an optimization should occur.
     * This is useful when code may not run consistently but runs as needed,
     * meaning that checking after a fixed amount of time might mean that an inconsistent or no actual iterations has occurred.
     * Interval should probably be set to Infinity in this case.
     *
     * @default Infinity
     */
    maxFrameSamples: number;
    /**
     * The amount of time to wait between sampling frames for a new optimization.
     * This is useful when an optimization may cause the framerate to drop for a frame or two --
     * such as with allocating a lot of new memory or new webgl render targets.
     *
     * @default 0
     */
    waitMillis: number;
    /**
     * At most how many frames to wait for.
     *
     * @default Infinity
     */
    maxWaitFrames: number;
    /**
     * How far outside of the target framerate must be in order for an optimization to occurs.
     * @default 0.05 (5%)
     */
    margin: number;
    /**
     * By default the optimizer will stop trying to optimize and optimization
     * the page once the target framerate is hit or no more optimizations can run
     * and will never try to improve quality of the page again after the first iteration.
     *
     * This option allows the optimizer to ping pong between
     * improving performance and quality continually to keep a steady framerate.
     *
     * Note that this may not be a good option when using "expensive"
     * optimizations that may stall the frame for a moment, like compiling shaders.
     *
     * @default false
     */
    continuallyRefine: boolean;
    /**
     * Whether the optimizer should ever try to increase the amount of work done at the cost of framerate.
     * After the quality improvements are made the optimizer tries to improve the framerate until the target framerate is met.
     *
     * @default false
     */
    increaseWork: boolean;
};
