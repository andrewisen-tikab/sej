import * as THREE from 'three';
// @ts-ignore
import WebGPU from 'three/addons/capabilities/WebGPU.js';
// @ts-ignore
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { TilesRenderer } from '3d-tiles-renderer';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import CameraControls from 'camera-controls';
import localForage from 'localforage';

import { InitProps } from './types';
import ErrorManager from './utils/ErrorManager';

import { EventDispatcher, Listener } from './core/events/EventDispatcher';
import { SejEventKeys, SejEvents } from './core/events/types';

import _History from './core/history/History';
import Command from './core/commands/Command';
import { AddObjectCommand } from './core/commands';
import AddTilesetCommand from './core/commands/AddTilesetCommand';
import { AddObjectCommandParams } from './core/commands/AddObjectCommand';

/**
 * The seconds passed since the time `.oldTime` was set and sets `.oldTime` to the current time.
 */
let _clockDelta = /* @__PURE__ */ 0;
let _i = /* @__PURE__ */ 0;
let _animationMixer: /* @__PURE__ */ THREE.AnimationMixer;

/**
 * Sej [ˈsɛj].
 */
export default class Sej extends EventDispatcher {
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

    /**
     * The AnimationMixer is a player for animations on a particular object in the scene.
     * When multiple objects in the scene are animated independently, one AnimationMixer may be used for each object.
     */
    private animationMixers: THREE.AnimationMixer[];

    /**
     * Handles and keeps track of loaded and pending data.
     */
    private loadingManager: THREE.LoadingManager;

    /**
     * History manager.
     */
    private history: _History;

    private stats: Stats;

    /**
     * Makes a floating panel for controllers on the web.
     * Works as a drop-in replacement for dat.gui in most projects.
     */
    private gui: GUI;

    /**
     * Three.js renderer implementation for the 3D Tiles format.
     * The renderer supports most of the 3D Tiles spec features with a few exceptions.
     */
    private tilesRenderer: TilesRenderer | null = null;

    private renderer: WebGPURenderer | null = null;

    /**
     * A loader for geometry compressed with the Draco library.
     * Draco is an open source library for compressing and decompressing 3D meshes and point clouds.
     * Compressed geometry can be significantly smaller, at the cost of additional decoding time on the client device.
     */
    private dracoLoader: DRACOLoader;

    /**
     * A loader for glTF 2.0 resources.
     *
     * glTF (GL Transmission Format) is an open format specification for efficient delivery and loading of 3D content.
     * Assets may be provided either in JSON (.gltf) or binary (.glb) format.
     *
     * External files store textures (.jpg, .png) and additional binary data (.bin).
     * A glTF asset may deliver one or more scenes,
     * including
     * - meshes
     * - materials
     * - textures
     * - skins
     * - skeletons
     * - morph targets
     * - animations
     * - lights
     * - cameras
     */
    private gltfLoader: GLTFLoader;

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
        playAnimation: false,
        commands: '',
    };

    /**
     * API for {@link Sej}.
     *
     * Use this to access {@link Sej}'s methods.
     */
    public api = {
        execute: this.execute,
        loadModel: this.loadModel,
        loadTileset: this.loadTileset,
        addObject: this.addObject,
    };

    constructor() {
        super();

        Object.entries(this.api).forEach(([key, value]) => {
            // @ts-ignore
            this.api[key] = value.bind(this);
        });

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
        this.loadingManager = new THREE.LoadingManager();
        this.history = new _History();
        this.stats = new Stats();

        this.dracoLoader = new DRACOLoader();
        this.gltfLoader = new GLTFLoader(this.loadingManager);
        this.loadingManager.addHandler(/\.gltf$/, this.gltfLoader);

        this.gui = new GUI();
        this.gui.add(this.state, 'commands').name('Latest command').listen();

        this._dev();
    }

    /**
     * @deprecated WIP
     */
    private _dev(): Sej {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ä':
                    console.log('Saving scene...');
                    localForage.setItem('sej', JSON.stringify(this.toJSON()));
                    break;
                case 'ö':
                    console.log('Loading scene...');
                    localForage
                        .getItem('sej')
                        .then((value) => {
                            this.fromJSON(JSON.parse(value as string));
                            console.log('Scene loaded.');
                        })
                        .catch((error: any) => {
                            console.log(error);
                        });
                    break;
                default:
                    break;
            }
        });

        return this;
    }

    /**
     * Add a {@link THREE.GridHelper} to the scene.
     */
    public addGridHelper(): Sej {
        const gridHelper = new THREE.GridHelper(10, 10, 0xffffff, 0xffffff);
        const gridMaterial = gridHelper.material as THREE.Material;
        gridMaterial.opacity = 0.2;
        gridMaterial.transparent = true;
        gridHelper.updateMatrix();

        this.scene.add(gridHelper);
        return this;
    }

    /**
     * Add a debug background to the scene.
     */
    public addDebugBackground(): Sej {
        this.renderer.setClearColor(new THREE.Color(0x263238).convertLinearToSRGB(), 1);
        return this;
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
     * Adds the specified event listener.
     * @param type event name
     * @param listener handler function
     */
    public addEventListener<K extends keyof SejEvents, T extends SejEvents[K]['data']>(
        type: K,
        listener: (event: Omit<SejEvents[K], 'data'> & { data: T }) => any,
    ): void {
        super.addEventListener(type, listener as Listener);
    }

    /**
     * Fire an event type.
     * @param event DispatcherEvent
     * @category Methods
     */
    public dispatchEvent<K extends keyof SejEvents, T extends SejEvents[K]>(event: T): void {
        super.dispatchEvent(event);
    }

    /**
     * @deprecated WIP
     */
    public init({ container }: InitProps): Sej {
        if (WebGPU.isAvailable() === false) {
            document.body.appendChild(WebGPU.getErrorMessage());
            throw new Error(ErrorManager.Init.WebGPU);
        }
        if (container == null) throw new Error(ErrorManager.Init.Container);
        this.container = container;

        this.container.appendChild(this.stats.dom);

        this.renderer = new WebGPURenderer();

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.container.appendChild(this.renderer.domElement);

        const controls = new OrbitControls(this.perspectiveCamera, this.renderer.domElement);
        const y = 3;
        this.perspectiveCamera.position.x = -0.4;
        this.perspectiveCamera.position.y = y;
        this.perspectiveCamera.position.z = 2;
        this.perspectiveCamera.updateMatrix();
        controls.target.set(0, y - 1, 0);
        controls.update();

        const light1 = new THREE.AmbientLight();
        this.perspectiveCamera.add(light1);
        const light2 = new THREE.DirectionalLight();
        light2.position.set(5, 10, 7.5);
        light2.updateMatrix();
        this.perspectiveCamera.add(light2);

        this.initLoadingManger(this.loadingManager);

        this.dracoLoader.setDecoderPath('../../libs/draco/gltf/');

        /**
         * Animation loop
         */
        const animate = () => {
            requestAnimationFrame(animate);
            _clockDelta = this.clock.getDelta();

            if (this.state.playAnimation) {
                for (_i = 0; _i < this.animationMixers.length; _i++) {
                    _animationMixer = this.animationMixers[_i];
                    _animationMixer.update(_clockDelta);
                }
            }

            this.stats.update();

            this.renderer.render(this.scene, this.perspectiveCamera);
            if (this.tilesRenderer) {
                this.perspectiveCamera.updateMatrixWorld();
                this.tilesRenderer.update();
            }
        };

        animate();

        this.dispatchEvent({ type: SejEventKeys.init });
        return this;
    }

    /**
     * Add event listeners.
     * @param loadingManager {@link THREE.LoadingManager}
     */
    private initLoadingManger(loadingManager: THREE.LoadingManager): void {
        loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            this.dispatchEvent({
                type: SejEventKeys.onStart,
                data: {
                    url,
                    itemsLoaded,
                    itemsTotal,
                },
            });
        };

        loadingManager.onLoad = () => {
            this.dispatchEvent({
                type: SejEventKeys.onLoad,
            });
        };

        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            this.dispatchEvent({
                type: SejEventKeys.onProgress,
                data: {
                    url,
                    itemsLoaded,
                    itemsTotal,
                },
            });
        };

        loadingManager.onError = (url) => {
            this.dispatchEvent({
                type: SejEventKeys.onError,
                data: {
                    url,
                },
            });
        };
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

        this.history.clear();
        this.gui.destroy();
        return this;
    }

    /**
     * @deprecated WIP
     */
    private loadModel(url: string, params?: AddObjectCommandParams): void {
        this.gltfLoader.load(url, (gltf) => {
            // Bypass `sej`'s default behavior of updating the matrix of the object
            gltf.scene.traverse((child) => {
                child.matrixAutoUpdate = true;
            });

            this.execute(new AddObjectCommand(gltf.scene, params));

            // Play the first animation
            if (gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(gltf.scene);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
                this.animationMixers.push(mixer);
            }
        });
    }

    /**
     * @deprecated WIP
     */
    private loadTileset(url: string, params?: AddObjectCommandParams): void {
        this.tilesRenderer = new TilesRenderer(url);
        this.initLoadingManger(this.tilesRenderer.manager);

        this.tilesRenderer.setCamera(this.perspectiveCamera);
        this.tilesRenderer.setResolutionFromRenderer(this.perspectiveCamera, this.renderer);

        const loader = new GLTFLoader(this.tilesRenderer.manager);
        loader.setDRACOLoader(this.dracoLoader);

        this.tilesRenderer.manager.addHandler(/\.gltf$/, loader);

        this.execute(new AddTilesetCommand(this.tilesRenderer.group, params));
    }

    /**
     * Load a JSON resource in the [JSON Object/Scene](https://github.com/mrdoob/three.js/wiki/JSON-Object-Scene-format-4) format.
     */
    private async fromJSON(json: ReturnType<Sej['toJSON']>) {
        this.scene.clear();
        const loader = new THREE.ObjectLoader();
        // const camera = (await loader.parseAsync(json.camera)) as typeof this.camera;
        // this.camera.copy(camera);

        const scene = (await loader.parseAsync(json.scene)) as THREE.Scene;

        this.setScene(scene);
    }

    /**
     * Set the scene of the {@link Sej} singleton.
     * @param scene
     */
    private setScene(scene: THREE.Scene): Sej {
        if (scene.isScene !== true) throw new Error(ErrorManager.THREE.IsScene);

        this.scene.uuid = scene.uuid;
        this.scene.name = scene.name;

        this.scene.background = scene.background;
        this.scene.environment = scene.environment;
        this.scene.fog = scene.fog;

        this.scene.userData = { ...scene.userData };

        while (scene.children.length > 0) {
            this.addObject(scene.children[0]);
        }

        return this;
    }

    /**
     * Add an object to the scene.
     * @param object
     * @param parent
     * @param index
     */
    private addObject(object: THREE.Object3D, parent?: THREE.Object3D, index: number = 0) {
        if (parent === undefined) {
            this.scene.add(object);
        } else {
            parent.children.splice(index, 0, object);
            object.parent = parent;
        }
        object.updateMatrix();

        this.dispatchEvent({
            type: SejEventKeys.objectAdded,
            data: { object },
        });
    }

    /**
     * Generate a JSON resource in the [JSON Object/Scene](https://github.com/mrdoob/three.js/wiki/JSON-Object-Scene-format-4) format.
     */
    private toJSON() {
        return {
            metadata: {},
            camera: this.perspectiveCamera.toJSON(),
            scene: this.scene.toJSON(),
        };
    }

    private execute(command: Command, optionalName?: string) {
        this.history.execute(command, optionalName);
        this.state.commands = command.type;
    }

    public getLoaders() {
        return {
            gltfLoader: this.gltfLoader,
        };
    }
}
