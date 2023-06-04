import * as THREE from 'three';
import '../assets/css/styles.css';

// @ts-ignore
import glb from '../assets/glb/spartan_armour_mkv_-_halo_reach.glb?url';
import ExampleBuilder from '../ExampleBuilder';
import { random } from '../utils';

const example = new ExampleBuilder({ url: glb, type: 'glb', up: '+Y' });
const position = new THREE.Vector3();
const randomMinMax = 1;
const initialTimeout = 1_000;
const timeout = 500;
const maxObjects = 5;
let currentObjects = 0;

setTimeout(() => {
    const interval = setInterval(() => {
        position.set(
            random(-randomMinMax, randomMinMax),
            random(-randomMinMax, randomMinMax),
            random(-randomMinMax, randomMinMax),
        );
        example.sej.api.loadModel(glb, { position });
        currentObjects++;
        if (currentObjects >= maxObjects) {
            clearInterval(interval);
            console.log('Done! Loaded ', currentObjects, ' objects.');
        }
    }, timeout);
}, initialTimeout);
