import './style.css';

import Sej from '../../src/';
import { SejEventKeys } from '../../src/core/events/types';

const container = document.getElementById('app') as HTMLDivElement | null;
if (container == null) throw new Error('Container not found');

Sej.addEventListener(SejEventKeys.init, (e) => {
    console.log('Init done!');
});

Sej.install();
Sej.init({ container });
