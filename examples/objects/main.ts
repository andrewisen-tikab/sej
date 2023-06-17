import '../assets/css/styles.css';

// @ts-ignore
import original from '../assets/glb/pringles-original.glb?url';
// @ts-ignore
import bbq from '../assets/glb/pringles-bbq.glb?url';
// @ts-ignore
import extraHot from '../assets/glb/pringles-extra-hot.glb?url';
// @ts-ignore
import paprika from '../assets/glb/pringles-paprika.glb?url';

const models = [original, bbq, extraHot, paprika];
import ExampleBuilder from '../ExampleBuilder';

const example = new ExampleBuilder({ url: models[0], type: 'glb', up: '+Y' });

example.sej;
