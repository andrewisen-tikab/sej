const ErrorManager = {
    Init: {
        WebGPU: 'No WebGPU support',
        Container: 'Container is null or undefined.',
    },
    THREE: {
        IsScene: `Object is not a "THREE.Scene".`,
    },
} as const;

export default ErrorManager;
