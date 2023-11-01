/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable class-methods-use-this */
import * as THREE from 'three';



import type { KeyboardControls } from './types';


/**
 * Abstract class for all keyboard controls implementations.
 */
export class AbstractKeyboardControls extends THREE.EventDispatcher implements KeyboardControls {
    enabled: boolean;

    object: THREE.Object3D<THREE.Object3DEventMap>;

    domElement: HTMLCanvasElement;

    onKeyDownEvent: (event: KeyboardEvent) => void;

    onKeyUpEvent: (event: KeyboardEvent) => void;

    /**
     * E.g. `KeyW = true`
     */
    keyStates: Record<string, boolean>;

    constructor(object: THREE.Object3D, domElement: HTMLCanvasElement) {
        super();
        this.enabled = true;
        this.object = object;
        this.domElement = domElement;
        // this.domElement = domElement

        this.keyStates = {};

        /**
         * @param {KeyboardEvent} event
         */
        const initialKeyDown = (event: KeyboardEvent) => {
            if (this.enabled === false) return;
            this.keyStates[event.code] = true;
            this.onKeyDown(event);
        };

        /**
         * @param {KeyboardEvent} event
         */
        const initialKeyUp = (event: KeyboardEvent): void => {
            if (this.enabled === false) return;
            this.keyStates[event.code] = false;
            this.onKeyUp(event);
        };

        // Create closures to be able to remove event listeners later on.
        this.onKeyDownEvent = initialKeyDown.bind(this);
        this.onKeyUpEvent = initialKeyUp.bind(this);

        this.activate();
    }

    /**
     * Write your own onKeyDown function in your implementation.
     * @param event
     */
    onKeyDown(_event: KeyboardEvent) {}

    /**
     * Write your own onKeyUp function in your implementation.
     * @param event
     */
    onKeyUp(_event: KeyboardEvent) {}

    public update(_delta: number) {}

    activate() {
        // https://stackoverflow.com/a/12887221/18728423
        this.domElement.tabIndex = 1;
        this.domElement.addEventListener('keydown', this.onKeyDownEvent, false);
        this.domElement.addEventListener('keyup', this.onKeyUpEvent, false);
    }

    deactivate() {
        this.domElement.removeEventListener('keydown', this.onKeyDownEvent, false);
        this.domElement.removeEventListener('keyup', this.onKeyUpEvent, false);
    }
}