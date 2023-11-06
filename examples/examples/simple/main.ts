/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractExampleFactory } from '../../../src/Sej';
import '../../assets/css/styles.css';
import { AbstractExample } from '../../src/AbstractExample';

const example = new AbstractExample(new AbstractExampleFactory().build());
example.init();
