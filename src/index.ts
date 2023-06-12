import SejEngine from './Sej';
import { SejEventKeys } from './core/events/types';
import type { SejEvents } from './core/events/types';
import * as Commands from './core/commands';
import Manager from './managers/manager';
import { default as _SejCore } from './core';

/**
 * Sej Engine as singleton.
 */
const SejCore = _SejCore.Instance;
/**
 * Sej Engine as singleton.
 */
const Sej = SejEngine.Instance;

export default Sej;
export { SejCore, SejEngine, SejEvents, SejEventKeys, Commands, Manager };
