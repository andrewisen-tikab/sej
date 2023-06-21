import '../assets/css/styles.css';

// @ts-ignore
import glb from '../assets/glb/spartan_armour_mkv_-_halo_reach.glb?url';
import ExampleBuilder from '../ExampleBuilder';

const example = new ExampleBuilder({ url: glb, type: 'glb', up: '+Y' });
const { sej } = example;
const gui = sej.core.getGUI();
const params = {
    fit: () => {
        sej.managers.controls.fit();
    },
} as const;

const exampleFolder = gui.addFolder('Example');

exampleFolder.add(params, 'fit').name('Fit');
