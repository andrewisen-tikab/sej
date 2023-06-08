import '../assets/css/styles.css';

import * as THREE from 'three';
// @ts-ignore
import glb from '../assets/glb/spartan_armour_mkv_-_halo_reach.glb?url';
import ExampleBuilder from '../ExampleBuilder';

const position = new THREE.Vector3(0, 0, 0);
new ExampleBuilder({ url: glb, type: 'glb', up: '+Y', position });
