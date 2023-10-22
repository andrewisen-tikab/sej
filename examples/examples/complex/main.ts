/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComplexExampleFactory } from '../../../src/factory/ComplexExampleFactory';
import '../../assets/css/styles.css';
import { AbstractExample } from '../../src/AbstractExample';

const example = new AbstractExample(new ComplexExampleFactory());
example.init();
