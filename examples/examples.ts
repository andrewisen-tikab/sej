// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EXAMPLES } from '../examples.js';

const div = document.createElement('div');

const h1 = document.createElement('h1');
h1.textContent = 'Sej Examples';
div.appendChild(h1);

const ul = document.createElement('ul');
ul.id = 'ul';

EXAMPLES.forEach((example: string) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = `${example}`;
    a.href = `./examples/${example}/`;
    li.appendChild(a);
    ul.appendChild(li);
});

div.appendChild(ul);

document.body.appendChild(div);
