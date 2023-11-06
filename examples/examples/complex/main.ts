/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComplexExampleFactory } from '../../../src/factory/ComplexExampleFactory';
import '../../assets/css/styles.css';
import { AbstractExample } from '../../src/AbstractExample';

const sejEngine = new ComplexExampleFactory().build();
const example = new AbstractExample(sejEngine);
example.init();
