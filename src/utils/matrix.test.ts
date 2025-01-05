import * as THREE from 'three';

import { describe, expect, it, vi } from 'vitest';

import { updateMatrixWorld } from './matrix';

describe('updateMatrixWorld', () => {
    it('should update the world matrix of the object', () => {
        const object = new THREE.Object3D();
        object.matrixWorldAutoUpdate = false;

        // Initial state
        expect(object.matrixWorldAutoUpdate).toBe(false);

        // Call the function
        updateMatrixWorld(object);

        // Check if the world matrix was updated
        expect(object.matrixWorldAutoUpdate).toBe(false);
        expect(object.matrixWorld).toBeDefined();
    });

    it('should temporarily set matrixWorldAutoUpdate to true if it is false', () => {
        const object = new THREE.Object3D();
        object.matrixWorldAutoUpdate = false;

        // Spy on updateMatrixWorld method
        const updateMatrixWorldSpy = vi.spyOn(object, 'updateMatrixWorld');

        // Call the function
        updateMatrixWorld(object);

        // Check if updateMatrixWorld was called with true
        expect(updateMatrixWorldSpy).toHaveBeenCalledWith(true);

        // Restore the spy
        updateMatrixWorldSpy.mockRestore();
    });

    it('should not change matrixWorldAutoUpdate if it is already true', () => {
        const object = new THREE.Object3D();
        object.matrixWorldAutoUpdate = true;

        // Spy on updateMatrixWorld method
        const updateMatrixWorldSpy = vi.spyOn(object, 'updateMatrixWorld');

        // Call the function
        updateMatrixWorld(object);

        // Check if updateMatrixWorld was called with true
        expect(updateMatrixWorldSpy).toHaveBeenCalledWith(true);

        // Check if matrixWorldAutoUpdate remains true
        expect(object.matrixWorldAutoUpdate).toBe(true);

        // Restore the spy
        updateMatrixWorldSpy.mockRestore();
    });
});
