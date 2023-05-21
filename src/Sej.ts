import * as THREE from 'three';
// @ts-ignore
import WebGPU from 'three/addons/capabilities/WebGPU.js';
// @ts-ignore
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import CameraControls from 'camera-controls';
import { InitProps } from './types';
import ErrorManager from './utils/ErrorManager';
/**
 * Sej [ˈsɛj].
 */
export default class Sej {
    /**
     * {@link Sej} singleton
     */
    private static _instance: Sej;

    /**
     * Generate {@link Sej} singleton
     */
    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    /**
     * {@link Sej}'s internal state.
     */
    private state = {
        hasInstalled: false,
    };

    /**
     * Install dependencies and setup `three`.
     * @returns Returns {@link Sej} singleton
     */
    public install(): Sej {
        if (this.state.hasInstalled) return this;
        THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE = false;
        CameraControls.install({ THREE });
        THREE.Cache.enabled = true;
        // @ts-ignore
        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        // @ts-ignore
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        this.state.hasInstalled = true;
        return this;
    }

    /**
     * @deprecated WIP
     */
    public init({ container }: InitProps) {
        if (WebGPU.isAvailable() === false) {
            document.body.appendChild(WebGPU.getErrorMessage());
            throw new Error(ErrorManager.Init.WebGPU);
        }
        if (container == null) throw new Error(ErrorManager.Init.Container);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );

        const renderer = new WebGPURenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        function animate() {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        }

        animate();
    }
}
