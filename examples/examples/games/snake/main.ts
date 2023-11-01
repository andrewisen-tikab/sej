/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComplexExampleFactory } from '../../../../src/factory/ComplexExampleFactory';
import '../../../assets/css/styles.css';
import { AbstractExample } from '../../../src/AbstractExample';
import { SnakeKeyboardControls } from './SnakeKeyboardControls';

const factory = new ComplexExampleFactory({ keyboardControls: SnakeKeyboardControls });
const example = new AbstractExample(factory);

example.init(true, false);

const sej = example.sej!;
const {
    editor: { scene },
    spatialHashGrid,
} = sej;

const keyboardControls = sej.keyboardControls as SnakeKeyboardControls;
keyboardControls.init(scene, spatialHashGrid);
