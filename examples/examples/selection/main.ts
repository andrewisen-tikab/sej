/* eslint-disable @typescript-eslint/no-unused-vars */
import * as THREE from 'three';

import * as MultiSelect from 'three-multi-select';

import { ComplexExampleFactory } from '../../../src/factory/ComplexExampleFactory';
import '../../assets/css/styles.css';
import { AbstractExample } from '../../src/AbstractExample';

type Mesh = THREE.Mesh<THREE.BufferGeometry, THREE.Material> & {
    _material: THREE.Material;
};

const sejEngine = new ComplexExampleFactory().build();
const example = new AbstractExample(sejEngine);

example.init(true, false);

const {
    editor,
    editor: { scene, camera },
    viewportControls,
    renderer,
} = sejEngine;
const group = new THREE.Group();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const selectMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube1 = new THREE.Mesh(geometry, material);
cube1.position.setX(-3);
cube1.name = '1';
group.add(cube1);
const cube2 = new THREE.Mesh(geometry, material);
group.add(cube2);
cube2.position.setX(0);
cube2.name = '2';
const cube3 = new THREE.Mesh(geometry, material);
group.add(cube3);
cube3.position.setX(3);
cube3.name = '3';

group.translateX(5);
group.translateZ(5);

scene.add(group);

const multiSelect = new MultiSelect.MultiSelect(
    camera as THREE.PerspectiveCamera,
    renderer.domElement,
    group.children,
    {
        cameraControls: viewportControls,
    },
);

// The multi select will do nothing until we add event listeners.

multiSelect.addEventListener<'select', Mesh>('select', (event) => {
    const { object } = event;

    // eslint-disable-next-line no-underscore-dangle
    object._material = object.material;
    // And then we change the material.
    object.material = selectMaterial;
    editor.select(object);
});

multiSelect.addEventListener<'deselect', Mesh>('deselect', (event) => {
    const { object } = event;
    // eslint-disable-next-line no-underscore-dangle
    object.material = object._material;
    editor.deselect(object);
});

scene.add(multiSelect.scene);
