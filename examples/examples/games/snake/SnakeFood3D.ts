import * as THREE from 'three';

import { Snake3D } from './Snake3D';

/**
 * Snake food object.
 */
export class SnakeFood3D extends Snake3D {
    update() {
        const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(geometry, material);

        cube.translateY(this.height / 2);

        this.add(cube);
    }
}
