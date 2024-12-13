/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComplexExampleFactory, type ExampleFactorParams } from '../../../src/Sej';
import { WebGPURenderer } from '../../../src/renderer/WebGPURenderer';
import '../../assets/css/styles.css';
import { AbstractExample } from '../../src/AbstractExample';

const params = {
    Renderer: WebGPURenderer,
} satisfies Partial<ExampleFactorParams>;
const example = new AbstractExample(new ComplexExampleFactory(params).build());
example.init();
