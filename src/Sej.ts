import * as THREE from 'three';
// @ts-ignore
import WebGPU from 'three/addons/capabilities/WebGPU.js';
// @ts-ignore
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import CameraControls from 'camera-controls';
import { InitProps } from './types';
import ErrorManager from './utils/ErrorManager';

// @ts-ignore
import glb from '../public/glb/spartan_armour_mkv_-_halo_reach.glb?url';

/**
 * The seconds passed since the time `.oldTime` was set and sets `.oldTime` to the current time.
 */
let _clockDelta = /* @__PURE__ */ 0;
let _i = /* @__PURE__ */ 0;
let _animationMixer: /* @__PURE__ */ THREE.AnimationMixer;

/**
 * Sej [ˈsɛj].
 */
export default class Sej {
    /**
     * {@link Sej} singleton
     */
    private static _instance: Sej;

    private container: HTMLDivElement | null = null;

    /**
     * Scenes allow you to set up what and where is to be rendered by three.js.
     * This is where you place objects, lights and cameras.
     */
    private scene: THREE.Scene;

    /**
     * Camera that uses perspective projection.
     *
     * This projection mode is designed to mimic the way the human eye sees.
     * It is the most common projection mode used for rendering a 3D scene.
     */
    private perspectiveCamera: THREE.PerspectiveCamera;

    /**
     * Object for keeping track of time.
     * This uses `performance.now` if it is available,
     * otherwise it reverts to the less accurate `Date.now`.
     */
    private clock: THREE.Clock;

    private animationMixers: THREE.AnimationMixer[];

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

    constructor() {
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        this.scene.add(this.perspectiveCamera);
        this.animationMixers = [];
    }

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
        this.container = container;

        const renderer = new WebGPURenderer();

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        this.container.appendChild(renderer.domElement);

        const controls = new OrbitControls(this.perspectiveCamera, renderer.domElement);
        this.perspectiveCamera.position.x = -0.4;
        this.perspectiveCamera.position.y = 3.2;
        this.perspectiveCamera.position.z = 1;
        controls.target.set(0, 3.5 - 1, 0);
        controls.update();

        const light1 = new THREE.AmbientLight();
        this.perspectiveCamera.add(light1);
        const light2 = new THREE.DirectionalLight();
        light2.position.set(5, 10, 7.5);
        this.perspectiveCamera.add(light2);

        const loader = new GLTFLoader();
        loader.load(glb, (gltf) => {
            gltf.scene.traverse((child) => {
                child.matrixAutoUpdate = true;
            });
            this.scene.add(gltf.scene);

            if (gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(gltf.scene);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
                this.animationMixers.push(mixer);
            }
        });

        const animate = () => {
            requestAnimationFrame(animate);
            _clockDelta = this.clock.getDelta();

            for (_i = 0; _i < this.animationMixers.length; _i++) {
                _animationMixer = this.animationMixers[_i];
                _animationMixer.update(_clockDelta);
            }

            renderer.render(this.scene, this.perspectiveCamera);
        };

        animate();
    }

    /**
     * Dispose {@link Sej} singleton.
     * @returns Returns {@link Sej} singleton
     */
    public dispose(): Sej {
        // Dispose container, if possible.
        if (this.container) {
            this.container.innerHTML = null as unknown as any;
            this.container = null;
        }

        return this;
    }
}
