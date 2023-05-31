import '../assets/css/styles.css';
// @ts-ignore
import tileset from '../assets/tilesets/city/tileset.json?url';

import ExampleBuilder from '../ExampleBuilder';

new ExampleBuilder({ url: tileset, type: 'tileset' });
