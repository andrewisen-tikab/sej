import '../assets/css/styles.css';

import ExampleBuilder from '../ExampleBuilder';

const tileset = '../../assets/tilesets/city/tileset.json';

const urlParams = new URLSearchParams(window.location.search);
const api = urlParams.get('api');
const useWebGL = urlParams.get('useWebGL') === 'true' ?? false;
if (api == null) throw new Error('API not found');

new ExampleBuilder({ url: tileset, type: 'google-tileset', api, up: '+Z', useWebGL });
