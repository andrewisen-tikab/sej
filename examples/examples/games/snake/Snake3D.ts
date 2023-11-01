import * as THREE from 'three';

/**
 * Snake object.
 */
export class Snake3D extends THREE.Object3D {
    width: number = 1;

    height: number = 1;

    depth: number = 1;

    boundingBox: THREE.Box3;

    constructor() {
        super();
        this.boundingBox = new THREE.Box3();
        this.update();
    }

    update() {
        const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        this.boundingBox.setFromObject(cube);

        cube.translateY(this.height / 2);

        this.add(cube);
    }
}
