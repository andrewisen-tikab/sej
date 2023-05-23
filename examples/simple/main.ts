import './style.css';

import Sej from '../../src/';
import { SejEventKeys } from '../../src/core/events/types';

const container = document.getElementById('app') as HTMLDivElement | null;
if (container == null) throw new Error('Container not found');

Sej.addEventListener(SejEventKeys.init, (e) => {
    console.log('Init done!');
});

Sej.addEventListener(SejEventKeys.onStart, (e) => {
    const {
        data: { url, itemsLoaded, itemsTotal },
    } = e;
    console.log(
        'Started loading file: ' +
            url +
            '.\nLoaded ' +
            itemsLoaded +
            ' of ' +
            itemsTotal +
            ' files.',
    );
});

Sej.addEventListener(SejEventKeys.onProgress, (e) => {
    const {
        data: { url, itemsLoaded, itemsTotal },
    } = e;
    console.log(
        'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.',
    );
});

Sej.addEventListener(SejEventKeys.onLoad, (e) => {
    console.log('Loading complete!');
});

Sej.install();
Sej.init({ container });
