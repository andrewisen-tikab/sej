import * as THREE from 'three';
// @ts-ignore
import WebGPU from 'three/addons/capabilities/WebGPU.js';
// @ts-ignore
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

import { default as _History } from './history/History';
import { GoogleTilesRenderer, TilesRenderer } from '3d-tiles-renderer';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import CameraControls from 'camera-controls';
import { Listener } from 'camera-controls/dist/EventDispatcher';
import Sej, { SejEvents, SejEventKeys } from '..';

import { InitProps } from '../types';
import ErrorManager from '../utils/ErrorManager';
import { AddObjectCommand } from './commands';
import { AddObjectCommandParams } from './commands/AddObjectCommand';
import AddTilesetCommand from './commands/AddTilesetCommand';
import Command from './commands/Command';
import { EventDispatcher } from './events/EventDispatcher';
import Selector from './selector/Selector';
import SetPositionCommand from './commands/SetPositionCommand';
import SetRotationCommand from './commands/SetRotationCommand';
import SetScaleCommand from './commands/SetScaleCommand';

/**
 * The seconds passed since the time `.oldTime` was set and sets `.oldTime` to the current time.
 */
let _clockDelta = /* @__PURE__ */ 0;
let _i = /* @__PURE__ */ 0;
let _animationMixer: /* @__PURE__ */ THREE.AnimationMixer;
const _box = /* @__PURE__ */ new THREE.Box3();
const objectPositionOnDown = /* @__PURE__ */ new THREE.Vector3();
const objectRotationOnDown = /* @__PURE__ */ new THREE.Euler();
const objectScaleOnDown = /* @__PURE__ */ new THREE.Vector3();

/**
 * Sej [ˈsɛj] core.
 * Use getters and setters to access private properties.
 * E.g.
 * ```ts
 * this.getLoaders()
 * ```
 */
export default class SejCore extends EventDispatcher {
    /**
     * {@link SejCore} singleton
     */
    private static _instance: SejCore;

    /**
     * Tracks how often is a material used by a 3D object.
     */
    private materialsRefCounter: Map<any, any>;

    /**
     * Buffer Geometries used by Sej
     */
    private geometries: { [key: string]: THREE.BufferGeometry };

    /**
     * Materials uses  by Sej.
     */
    private materials: { [key: string]: THREE.Material };

    private cameraControls: CameraControls | null = null;

    private selector: Selector;

    private transformControls: TransformControls | null = null;

    /**
     * Generate {@link SejCore} singleton
     */
    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    /**
     * {@link HTMLDivElement} element that contains the canvas.
     */
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

    /**
     * This object provides a simple info box that will help you monitor your code performance.
     */
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
    private tilesRenderers: TilesRenderer[] = [];

    /**
     * The WebGPU renderer displays your beautifully crafted scenes using WebGPU.
     */
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
     * {@link Sej}'s internal state.
     */
    private state = {
        hasInstalled: false,
        playAnimation: false,
        commands: '',
        selected: '',
        undo: () => {
            this.api.undo();
        },
        redo: () => {
            this.api.redo();
        },
    };

    /**
     * API for {@link Sej}.
     *
     * Use this to access {@link Sej}'s methods.
     */
    public api = {
        addEventListener: this.addEventListener,
        removeEventListener: this.removeEventListener,
        dispatchEvent: this.dispatchEvent,
        execute: this.execute,
        loadModel: this.loadModel,
        loadTileset: this.loadTileset,
        loadGoogleTileset: this.loadGoogleTileset,
        addObject: this.addObject,
        removeObject: this.removeObject,
        fromJSON: this.fromJSON,
        toJSON: this.toJSON,
        undo: this.undo,
        redo: this.redo,
        select: this.select,
        deselect: this.deselect,
        getObjectByUUID: this.getObjectByUUID,
    };

    /**
     * Setup variables and event listeners.
     */
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
        this.selector = new Selector();
        this.stats = new Stats();

        this.dracoLoader = new DRACOLoader();
        this.gltfLoader = new GLTFLoader(this.loadingManager);
        this.loadingManager.addHandler(/\.gltf$/, this.gltfLoader);

        this.geometries = {};
        this.materials = {};

        this.materialsRefCounter = new Map();

        this.gui = new GUI();

        const selectionFolder = this.gui.addFolder('Selection');
        selectionFolder.add(this.state, 'selected').name('Selected UUID').listen();

        const commandsFolder = this.gui.addFolder('Commands');
        commandsFolder.add(this.state, 'commands').name('Latest command').listen();
        commandsFolder.add(this.state, 'undo').name('Undo');
        commandsFolder.add(this.state, 'redo').name('Redo');
    }

    /**
     * Install dependencies and setup `three`.
     * @returns Returns {@link Sej} singleton
     */
    public install(): SejCore {
        if (this.state.hasInstalled) return this;
        // THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE = false;
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
     * Initialize {@link Sej}.
     */
    public init({ container, webGLFallback = true, useWebGL }: InitProps): SejCore {
        let replaceRenderer = useWebGL ?? false;

        if (WebGPU.isAvailable() === false) {
            if (webGLFallback) {
                replaceRenderer = true;
            } else {
                document.body.appendChild(WebGPU.getErrorMessage());
                throw new Error(ErrorManager.Init.WebGPU);
            }
        }
        if (container == null) throw new Error(ErrorManager.Init.Container);
        this.container = container;

        this.container.appendChild(this.stats.dom);

        this.renderer = new WebGPURenderer();
        if (replaceRenderer) {
            this.renderer = new THREE.WebGLRenderer();
        }
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.container.appendChild(this.renderer.domElement);

        const y = 3;
        this.perspectiveCamera.position.x = -0.4;
        this.perspectiveCamera.position.y = y;
        this.perspectiveCamera.position.z = 2;
        this.perspectiveCamera.updateMatrix();

        const cameraControls = new CameraControls(this.perspectiveCamera, this.renderer.domElement);
        this.cameraControls = cameraControls;

        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        const transformControls = new TransformControls(this.perspectiveCamera, this.container);
        this.transformControls = transformControls;

        // TODO: Refactor to manager
        transformControls.addEventListener('change', () => {
            const { object } = transformControls;
            if (object !== undefined) {
                _box.setFromObject(object, true);
            }
        });

        // TODO: Refactor to manager
        transformControls.addEventListener('mouseDown', () => {
            const { object } = transformControls;
            if (object) {
                const { position, rotation, scale } = object;
                objectPositionOnDown.copy(position);
                objectRotationOnDown.copy(rotation);
                objectScaleOnDown.copy(scale);
            }

            cameraControls.enabled = false;
        });
        transformControls.addEventListener('mouseUp', () => {
            const { object } = transformControls;

            if (object !== undefined) {
                switch (transformControls.getMode()) {
                    case 'translate':
                        if (!objectPositionOnDown.equals(object.position)) {
                            this.execute(
                                new SetPositionCommand(
                                    object,
                                    object.position,
                                    objectPositionOnDown,
                                ),
                            );
                        }

                        break;

                    case 'rotate':
                        if (!objectRotationOnDown.equals(object.rotation)) {
                            this.execute(
                                new SetRotationCommand(
                                    object,
                                    object.rotation,
                                    objectRotationOnDown,
                                ),
                            );
                        }

                        break;

                    case 'scale':
                        if (!objectScaleOnDown.equals(object.scale)) {
                            this.execute(
                                new SetScaleCommand(object, object.scale, objectScaleOnDown),
                            );
                        }

                        break;
                }
            }

            cameraControls.enabled = true;
        });
        this.scene.add(this.transformControls);

        const light1 = new THREE.AmbientLight();
        this.perspectiveCamera.add(light1);
        const light2 = new THREE.DirectionalLight();
        light2.position.set(5, 10, 7.5);
        light2.updateMatrix();
        this.perspectiveCamera.add(light2);

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

            this.perspectiveCamera.updateMatrixWorld();
            for (let u = 0; u < this.tilesRenderers.length; u++) {
                const tilesRenderer = this.tilesRenderers[u];
                tilesRenderer.update();
            }

            cameraControls.update(_clockDelta);
            this.renderer.render(this.scene, this.perspectiveCamera);
        };

        animate();

        this.dispatchEvent({ type: SejEventKeys.init });
        return this;
    }

    /**
     * Dispose {@link Sej} singleton.
     * @returns Returns {@link Sej} singleton
     */
    public dispose(): SejCore {
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
        const tilesRenderers = new TilesRenderer(url);
        this.tilesRenderers.push(tilesRenderers);

        tilesRenderers.setCamera(this.perspectiveCamera);
        tilesRenderers.setResolutionFromRenderer(this.perspectiveCamera, this.renderer);

        const loader = new GLTFLoader(tilesRenderers.manager);
        loader.setDRACOLoader(this.dracoLoader);

        tilesRenderers.manager.addHandler(/\.gltf$/, loader);

        this.execute(new AddTilesetCommand(tilesRenderers.group, params));
    }

    /**
     * @deprecated WIP
     */
    private loadGoogleTileset(api: string): void {
        THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE = true;

        const tilesRenderers = new GoogleTilesRenderer(api);
        this.tilesRenderers.push(tilesRenderers);
        // @ts-ignore
        tilesRenderers.setLatLonToYUp(
            59.3167 * THREE.MathUtils.DEG2RAD,
            18.0716 * THREE.MathUtils.DEG2RAD,
        ); // Stockholm, Sweden.

        tilesRenderers.setCamera(this.perspectiveCamera);
        tilesRenderers.setResolutionFromRenderer(this.perspectiveCamera, this.renderer);
        const loader = new GLTFLoader(tilesRenderers.manager);
        loader.setDRACOLoader(this.dracoLoader);
        tilesRenderers.manager.addHandler(/\.gltf$/, loader);
        const parent = new THREE.Group();
        parent.add(tilesRenderers.group);
        parent.scale.set(0.1, 0.1, 0.1);
        this.scene.add(parent);
    }

    /**
     * Load a JSON resource in the [JSON Object/Scene](https://github.com/mrdoob/three.js/wiki/JSON-Object-Scene-format-4) format.
     */
    private async fromJSON(json: ReturnType<SejCore['toJSON']>) {
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
    private setScene(scene: THREE.Scene): SejCore {
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
    private addObject(object: THREE.Object3D, parent?: THREE.Object3D, index: number = 0): SejCore {
        object.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry !== undefined) this.addGeometry(mesh.geometry);
            if (mesh.material !== undefined) this.addMaterial(mesh.material);
        });

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
        return this;
    }

    /**
     * Resize the renderer and the camera.
     */
    private onWindowResize(): void {
        this.perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
        this.perspectiveCamera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Add a geometry to {@link Sej}..
     * @param geometry
     */
    private addGeometry(geometry: THREE.BufferGeometry): SejCore {
        this.geometries[geometry.uuid] = geometry;
        return this;
    }

    /**
     * Add material(s) to {@link Sej}.
     * @param material
     */
    private addMaterial(material: THREE.Material | THREE.Material[]): SejCore {
        if (Array.isArray(material)) {
            for (let i = 0, l = material.length; i < l; i++) {
                this.addMaterialToRefCounter(material[i]);
            }
        } else {
            this.addMaterialToRefCounter(material);
        }

        this.dispatchEvent({
            type: SejEventKeys.materialAdded,
        });
        return this;
    }

    /**
     * Add a single material to the `materialsRefCounter.`
     * @param material
     */
    private addMaterialToRefCounter(material: THREE.Material): SejCore {
        let materialsRefCounter = this.materialsRefCounter;

        let count = materialsRefCounter.get(material);

        if (count === undefined) {
            materialsRefCounter.set(material, 1);
            this.materials[material.uuid] = material;
        } else {
            count++;
            materialsRefCounter.set(material, count);
        }
        return this;
    }

    /**
     * Remove  an object from the scene.
     * @param object
     */
    private removeObject(object: THREE.Object3D): SejCore {
        if (object.parent === null) return this; // avoid deleting the camera or scene

        object.traverse((child) => {
            const mesh = child as THREE.Mesh;

            if (mesh.material !== undefined) this.removeMaterial(mesh.material);
        });

        object.parent.remove(object);

        this.dispatchEvent({
            type: SejEventKeys.objectRemoved,
            data: { object },
        });
        return this;
    }

    /**
     * Remove material(s) from {@link Sej}.
     * @param material
     */
    private removeMaterial(material: THREE.Material | THREE.Material[]): SejCore {
        if (Array.isArray(material)) {
            for (let i = 0, l = material.length; i < l; i++) {
                this.removeMaterialFromRefCounter(material[i]);
            }
        } else {
            this.removeMaterialFromRefCounter(material);
        }
        return this;
    }

    /**
     * Remove a single material to the `materialsRefCounter.`
     * @param material
     */
    private removeMaterialFromRefCounter(material: THREE.Material): SejCore {
        var materialsRefCounter = this.materialsRefCounter;

        let count = materialsRefCounter.get(material);
        count--;

        if (count === 0) {
            materialsRefCounter.delete(material);
            delete this.materials[material.uuid];
        } else {
            materialsRefCounter.set(material, count);
        }
        return this;
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

    private getObjectByUUID(uuid: string) {
        return this.scene.getObjectByProperty('uuid', uuid);
    }

    /**
     * Execute a {@link Command}.
     * @param command
     * @param optionalName
     * @returns
     */
    private execute(command: Command, optionalName?: string): SejCore {
        this.history.execute(command, optionalName);
        this.state.commands = command.type;
        return this;
    }

    /**
     * Undo the last executed {@link Command}.
     */
    undo(): SejCore {
        this.history.undo();
        return this;
    }

    /**
     * Redo the last executed {@link Command}.
     */
    redo(): SejCore {
        this.history.redo();
        return this;
    }

    /**
     * Get loading mangers used by {@link Sej}.
     */
    public getLoaders() {
        return {
            loadingManager: this.loadingManager,
            gltfLoader: this.gltfLoader,
            tilesRenderer: this.tilesRenderers,
        };
    }

    /**
     * Get a direct read-only references to the renderer.
     */
    public getRenderer() {
        return this.convertToReadOnly(this.renderer);
    }

    /**
     * Get a direct read-only references to the GUI.
     */
    public getGUI() {
        return this.convertToReadOnly(this.gui);
    }

    /**
     * Get a direct read-only references to the scenes.
     */
    public getControls() {
        return this.convertToReadOnly({
            cameraControls: this.cameraControls,
        });
    }

    /**
     * Get a direct read-only references to the scenes.
     */
    public getScenes() {
        return this.convertToReadOnly({
            scene: this.scene,
        });
    }

    /**
     * Convert get method to return readonly parameters
     */
    private convertToReadOnly<T>(object: T) {
        return object as Readonly<T>;
    }

    private select(object: THREE.Object3D | null): SejCore {
        if (this.selector.select(object) === false) return this;

        this.state.selected = object?.uuid ?? '';
        if (this.transformControls) this.transformControls.detach();
        if (object && this.transformControls) this.transformControls.attach(object);
        this.dispatchEvent({ type: SejEventKeys.select, data: { object } });
        return this;
    }

    private deselect(): SejCore {
        this.selector.deselect();
        this.state.selected = '';
        if (this.transformControls) this.transformControls.detach();
        this.dispatchEvent({ type: SejEventKeys.deselect });
        return this;
    }
}
