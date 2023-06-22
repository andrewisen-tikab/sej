import Sej, { SejEventKeys } from '../../src';
import '../assets/css/styles.css';

// @ts-ignore
import glb from '../assets/glb/spartan_armour_mkv_-_halo_reach.glb?url';
import ExampleBuilder from '../ExampleBuilder';

const example = new ExampleBuilder({ url: glb, type: 'glb', up: '+Y' });
setTimeout(() => {
    const { scene } = example.sej.core.getScenes();
    const object = scene.children[scene.children.length - 1];
    example.sej.api.select(object);
}, 1_000);
