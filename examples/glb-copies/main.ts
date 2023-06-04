import * as THREE from 'three';
import '../assets/css/styles.css';

// @ts-ignore
import glb from '../assets/glb/simple_metal_fence.glb?url';
import ExampleBuilder from '../ExampleBuilder';
import { AddObjectCommand } from '../../src/core/commands';
const scale = new THREE.Vector3(0.1, 0.1, 0.1);
const amount = 100;

const example = new ExampleBuilder({ type: 'glb', up: '+Y' });

example.sej.getLoaders().gltfLoader.load(glb, (gltf) => {
    for (let i = 0; i < amount; i++) {
        const clone = gltf.scene.clone();
        clone.scale.copy(scale);
        clone.position.set(0, 0, i * 2);
        clone.updateMatrix();
        example.sej.api.addObject(clone);
    }
});
