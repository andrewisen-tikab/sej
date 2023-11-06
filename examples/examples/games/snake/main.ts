/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComplexExampleFactory } from '../../../../src/factory/ComplexExampleFactory';
import type { ExampleFactorParams } from '../../../../src/factory/types';
import '../../../assets/css/styles.css';
import { AbstractExample } from '../../../src/AbstractExample';
import { SnakeKeyboardControls } from './SnakeKeyboardControls';

const params = { KeyboardControls: SnakeKeyboardControls } satisfies ExampleFactorParams;

const sejEngine = new ComplexExampleFactory(params).build();

const example = new AbstractExample(sejEngine);
example.init(true, false);

const {
    editor: { scene },
    spatialHashGrid,
    keyboardControls,
} = sejEngine;

keyboardControls.init(scene, spatialHashGrid);
