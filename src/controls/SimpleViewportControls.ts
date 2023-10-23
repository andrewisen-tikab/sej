import * as THREE from 'three';

import { AbstractViewportControls } from './AbstractViewportControls';
import { ViewportControls } from './types';

const vector = new THREE.Vector3();
const box = new THREE.Box3();

const normalMatrix = new THREE.Matrix3();
const pointer = new THREE.Vector2();
const pointerOld = new THREE.Vector2();
const spherical = new THREE.Spherical();
const sphere = new THREE.Sphere();

const changeEvent = { type: 'change' } as const;

/**
 * Abstract class for all viewport controls implementations.
 */
export class SimpleViewportControls extends AbstractViewportControls implements ViewportControls {
    center: THREE.Vector3;

    panSpeed: number;

    zoomSpeed: number;

    rotationSpeed: number;

    dispose: () => void;

    /**
     * Usually the camera.
     */
    object: THREE.Object3D<THREE.Object3DEventMap>;

    constructor(object: THREE.Object3D, domElement: HTMLCanvasElement) {
        super(object, domElement);
        this.object = object;

        // API

        this.center = new THREE.Vector3();
        this.panSpeed = 0.002;
        this.zoomSpeed = 0.1;
        this.rotationSpeed = 0.005;

        // internals

        const STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
        let state = STATE.NONE;

        const delta = new THREE.Vector3();

        // mouse

        /**
         * Handles mouse down events.
         * @param event
         */
        const onMouseDown = (event: PointerEvent) => {
            if (event.button === 0) {
                state = STATE.ROTATE;
            } else if (event.button === 1) {
                state = STATE.ZOOM;
            } else if (event.button === 2) {
                state = STATE.PAN;
            }

            pointerOld.set(event.clientX, event.clientY);
        };

        /**
         * Handles mouse move events.
         * @param event
         */
        const onMouseMove = (event: PointerEvent) => {
            pointer.set(event.clientX, event.clientY);

            const movementX = pointer.x - pointerOld.x;
            const movementY = pointer.y - pointerOld.y;

            if (state === STATE.ROTATE) {
                this.rotate(delta.set(-movementX, -movementY, 0));
            } else if (state === STATE.ZOOM) {
                this.zoom(delta.set(0, 0, movementY));
            } else if (state === STATE.PAN) {
                this.pan(delta.set(-movementX, movementY, 0));
            }

            pointerOld.set(event.clientX, event.clientY);
        };

        /**
         * Handles mouse up events.
         */
        const onMouseUp = (): void => {
            state = STATE.NONE;
        };

        /**
         *
         * @param event
         * @returns
         */
        const onMouseWheel = (event: WheelEvent) => {
            if (this.enabled === false) return;
            event.preventDefault();
            // Normalize deltaY due to https://bugzilla.mozilla.org/show_bug.cgi?id=1392460
            this.zoom(delta.set(0, 0, event.deltaY > 0 ? 1 : -1));
        };

        /**
         *
         * @param event
         */
        const contextmenu = (event: MouseEvent): void => {
            event.preventDefault();
        };

        /**
         * Handles pointer move events.
         * @param event
         */
        const onPointerMove = (event: PointerEvent) => {
            if (this.enabled === false) return;

            switch (event.pointerType) {
                case 'mouse':
                case 'pen':
                    onMouseMove(event);
                    break;
                default:
                    break;
            }
        };

        /**
         * Handles pointer up events.
         * @param event
         */
        const onPointerUp = (event: PointerEvent) => {
            switch (event.pointerType) {
                case 'mouse':
                case 'pen':
                    onMouseUp();
                    break;

                default:
                    break;
            }

            domElement.ownerDocument.removeEventListener('pointermove', onPointerMove);
            domElement.ownerDocument.removeEventListener('pointerup', onPointerUp);
        };

        /**
         * Handles pointer down events.
         * @param event
         */
        const onPointerDown = (event: PointerEvent): void => {
            if (this.enabled === false) return;

            switch (event.pointerType) {
                case 'mouse':
                case 'pen':
                    onMouseDown(event);
                    break;
                default:
                    break;
            }

            domElement.ownerDocument.addEventListener('pointermove', onPointerMove);
            domElement.ownerDocument.addEventListener('pointerup', onPointerUp);
        };

        domElement.addEventListener('contextmenu', contextmenu);
        domElement.addEventListener('dblclick', onMouseUp);
        domElement.addEventListener('wheel', onMouseWheel, { passive: false });

        domElement.addEventListener('pointerdown', onPointerDown);

        // touch

        const touches = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
        const prevTouches = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];

        let prevDistance: number | null = null;

        /**
         * Handles touch start events.
         * @param event
         */
        const touchStart = (event: TouchEvent): void => {
            if (this.enabled === false) return;

            switch (event.touches.length) {
                case 1:
                    touches[0]
                        .set(event.touches[0].pageX, event.touches[0].pageY, 0)
                        .divideScalar(window.devicePixelRatio);
                    touches[1]
                        .set(event.touches[0].pageX, event.touches[0].pageY, 0)
                        .divideScalar(window.devicePixelRatio);
                    break;

                case 2:
                    touches[0]
                        .set(event.touches[0].pageX, event.touches[0].pageY, 0)
                        .divideScalar(window.devicePixelRatio);
                    touches[1]
                        .set(event.touches[1].pageX, event.touches[1].pageY, 0)
                        .divideScalar(window.devicePixelRatio);
                    prevDistance = touches[0].distanceTo(touches[1]);
                    break;
                default:
                    break;
            }

            prevTouches[0].copy(touches[0]);
            prevTouches[1].copy(touches[1]);
        };

        /**
         * Handles touch move events.
         * @param event
         */
        const touchMove = (event: TouchEvent): void => {
            if (this.enabled === false) return;

            event.preventDefault();
            event.stopPropagation();

            /**
             * Get closest touch.
             * @param touch
             * @param touches
             * @returns
             */
            const getClosest = (touch: THREE.Vector3, closestTouches: THREE.Vector3[]) => {
                let [closest] = closestTouches;

                // eslint-disable-next-line no-restricted-syntax
                for (const touch2 of closestTouches) {
                    if (closest.distanceTo(touch) > touch2.distanceTo(touch)) closest = touch2;
                }

                return closest;
            };

            switch (event.touches.length) {
                case 1:
                    touches[0]
                        .set(event.touches[0].pageX, event.touches[0].pageY, 0)
                        .divideScalar(window.devicePixelRatio);
                    touches[1]
                        .set(event.touches[0].pageX, event.touches[0].pageY, 0)
                        .divideScalar(window.devicePixelRatio);
                    this.rotate(
                        touches[0].sub(getClosest(touches[0], prevTouches)).multiplyScalar(-1),
                    );
                    break;

                case 2:
                    /* eslint-disable no-case-declarations */
                    touches[0]
                        .set(event.touches[0].pageX, event.touches[0].pageY, 0)
                        .divideScalar(window.devicePixelRatio);
                    touches[1]
                        .set(event.touches[1].pageX, event.touches[1].pageY, 0)
                        .divideScalar(window.devicePixelRatio);
                    const distance = touches[0].distanceTo(touches[1]);
                    this.zoom(delta.set(0, 0, prevDistance! - distance));
                    prevDistance = distance;

                    const offset0 = touches[0].clone().sub(getClosest(touches[0], prevTouches));
                    const offset1 = touches[1].clone().sub(getClosest(touches[1], prevTouches));
                    offset0.x = -offset0.x;
                    offset1.x = -offset1.x;

                    this.pan(offset0.add(offset1));
                    /* eslint-enable no-case-declarations */

                    break;

                default:
                    break;
            }

            prevTouches[0].copy(touches[0]);
            prevTouches[1].copy(touches[1]);
        };

        domElement.addEventListener('touchstart', touchStart, { passive: false });
        domElement.addEventListener('touchmove', touchMove, { passive: false });

        this.dispose = () => {
            domElement.removeEventListener('contextmenu', contextmenu);
            domElement.removeEventListener('dblclick', onMouseUp);
            domElement.removeEventListener('wheel', onMouseWheel);

            domElement.removeEventListener('pointerdown', onPointerDown);

            domElement.removeEventListener('touchstart', touchStart);
            domElement.removeEventListener('touchmove', touchMove);
        };
    }

    public focus(target: THREE.Object3D, delta: THREE.Vector3 = new THREE.Vector3()): void {
        let distance: number;

        box.setFromObject(target);

        if (box.isEmpty() === false) {
            box.getCenter(this.center);
            distance = box.getBoundingSphere(sphere).radius;
        } else {
            // Focusing on an Group, AmbientLight, etc
            this.center.setFromMatrixPosition(target.matrixWorld);
            distance = 0.1;
        }

        delta.set(0, 0, 1);
        delta.applyQuaternion(this.object.quaternion);
        delta.multiplyScalar(distance * 4);

        this.object.position.copy(this.center).add(delta);

        this._changeEvent();
    }

    pan(delta: THREE.Vector3) {
        const distance = this.object.position.distanceTo(this.center);

        delta.multiplyScalar(distance * this.panSpeed);
        delta.applyMatrix3(normalMatrix.getNormalMatrix(this.object.matrix));

        this.object.position.add(delta);
        this.center.add(delta);

        this._changeEvent();
    }

    zoom(delta: THREE.Vector3) {
        const distance = this.object.position.distanceTo(this.center);

        delta.multiplyScalar(distance * this.zoomSpeed);

        if (delta.length() > distance) return;

        delta.applyMatrix3(normalMatrix.getNormalMatrix(this.object.matrix));

        this.object.position.add(delta);

        this._changeEvent();
    }

    rotate(delta: THREE.Vector3) {
        vector.copy(this.object.position).sub(this.center);

        spherical.setFromVector3(vector);

        spherical.theta += delta.x * this.rotationSpeed;
        spherical.phi += delta.y * this.rotationSpeed;

        spherical.makeSafe();

        vector.setFromSpherical(spherical);

        this.object.position.copy(this.center).add(vector);

        this.object.lookAt(this.center);

        this._changeEvent();
    }

    protected _changeEvent() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.dispatchEvent(changeEvent);
    }

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    public update(_delta: number) {}

    public setCamera(_camera: THREE.Camera): void {
        const orthographic = _camera as THREE.OrthographicCamera;
        if (orthographic.isOrthographicCamera) {
            // eslint-disable-next-line no-alert
            alert("Can't use an orthographic camera.");
            throw new Error("Can't use an orthographic camera.");
        }

        this.object = _camera;
    }

    public test(): boolean {
        const dummy = new THREE.Vector3();
        this.focus(this.object, dummy);
        this.pan(dummy);
        this.zoom(dummy);
        this.rotate(dummy);
        return true;
    }
}
