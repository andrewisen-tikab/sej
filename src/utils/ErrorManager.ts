const ErrorManager = {
    Init: {
        WebGPU: 'No WebGPU support',
        Container: 'Container is null or undefined.',
    },
    THREE: {
        IsScene: `Object is not a "THREE.Scene".`,
    },
    Commands: {
        newPosition: 'newPosition is undefined',
        oldPosition: 'oldPosition is undefined',
        newRotation: 'newRotation is undefined',
        oldRotation: 'oldRotation is undefined',
        newScale: 'newScale is undefined',
        oldScale: 'oldScale is undefined',
        noObject: 'Object not found',
    },
} as const;

export default ErrorManager;
