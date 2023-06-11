import Sej from '..';
import Manager from './manager';
import * as THREE from 'three';

/**
 * Orientation manager.
 * Helps the user with orientation.
 */
export default class OrientationManager extends Manager {
    /**
     * Add a {@link THREE.GridHelper} to the scene.
     */
    public addGridHelper(): OrientationManager {
        const gridHelper = new THREE.GridHelper(10, 10, 0xffffff, 0xffffff);
        const gridMaterial = gridHelper.material as THREE.Material;
        gridMaterial.opacity = 0.2;
        gridMaterial.transparent = true;
        gridHelper.updateMatrix();

        Sej.api.addObject(gridHelper);
        return this;
    }
}
