/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractExampleFactory } from '../../../src/Sej';
import '../../assets/css/styles.css';
import { AbstractExample } from '../../src/AbstractExample';
import './styles.css';

const container = document.getElementById('viewport') as HTMLElement | null;
if (!container) throw new Error('Container not found');

const example = new AbstractExample(new AbstractExampleFactory({ container }).build());
example.init();
