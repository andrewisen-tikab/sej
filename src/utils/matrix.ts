import * as THREE from 'three';

/**
 * Updates the world matrix of a given THREE.Object3D instance.
 *
 * This function first updates the local matrix of the object, then temporarily
 * sets the `matrixWorldAutoUpdate` property to `true` if it is `false` to ensure
 * the world matrix is updated. After updating the world matrix, it restores the
 * original value of `matrixWorldAutoUpdate`.
 *
 * @param object - The THREE.Object3D instance whose world matrix needs to be updated.
 */
export const updateMatrixWorld = (object: THREE.Object3D): void => {
    object.updateMatrix();
    const { matrixWorldAutoUpdate } = object;

    // Bypass
    // eslint-disable-next-line no-param-reassign
    if (matrixWorldAutoUpdate === false) object.matrixWorldAutoUpdate = true;
    object.updateMatrixWorld(true);

    // eslint-disable-next-line no-param-reassign
    object.matrixWorldAutoUpdate = matrixWorldAutoUpdate;
};
