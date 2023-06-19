import '../assets/css/styles.css';

import * as THREE from 'three';
// @ts-ignore
import original from '../assets/glb/pringles-original.glb?url';
// @ts-ignore
import bbq from '../assets/glb/pringles-bbq.glb?url';
// @ts-ignore
import extraHot from '../assets/glb/pringles-extra-hot.glb?url';
// @ts-ignore
import paprika from '../assets/glb/pringles-paprika.glb?url';

const models = [original, bbq, extraHot, paprika] as const;
const { length: modelsLength } = models;
import ExampleBuilder from '../ExampleBuilder';
import { random } from '../utils';

const example = new ExampleBuilder({ url: models[0], type: 'glb', up: '+Y' });

const { sej } = example;
const gui = sej.core.getGUI();

const minMax = 5;

const getRandomModel = () => models[random(0, modelsLength - 1)];

const params = {
    addObject: () => {
        const randomPosition = new THREE.Vector3(
            random(-minMax, minMax),
            0,
            random(-minMax, minMax),
        );
        sej.api.loadModel(getRandomModel(), { position: randomPosition });
    },
    undo: () => {
        sej.api.undo();
    },
    redo: () => {
        sej.api.redo();
    },
} as const;

const exampleFolder = gui.addFolder('Example');

exampleFolder.add(params, 'addObject').name('Add Object');
exampleFolder.add(params, 'undo').name('Undo');
exampleFolder.add(params, 'redo').name('Redo');
