import './style.css';

import Sej from '../../src/';

const container = document.getElementById('app') as HTMLDivElement | null;
if (container == null) throw new Error('Container not found');
Sej.install();
Sej.init({ container });
