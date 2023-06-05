import '../assets/css/styles.css';

import ExampleBuilder from '../ExampleBuilder';

const tileset = '../../assets/tilesets/city/tileset.json';

new ExampleBuilder({ url: tileset, type: 'tileset', up: '+Z' });
