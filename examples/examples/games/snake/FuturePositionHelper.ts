import * as THREE from 'three';

/**
 * Future Position
 */
export class FuturePositionHelper extends THREE.Object3D {
    width: number = 1 / 10;

    height: number = 1 / 10;

    depth: number = 1 / 10;

    constructor() {
        super();
        this.update();
    }

    update() {
        const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(geometry, material);
        cube.translateY(this.height / 2);
        this.add(cube);
    }
}
