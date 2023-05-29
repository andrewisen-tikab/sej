import { default as _ } from './Sej';
import { SejEventKeys } from './core/events/types';
import type { SejEvents } from './core/events/types';
import * as Commands from './core/commands';
/**
 * Sej Engine as singleton.
 */
const Sej = _.Instance;

export default Sej;
export { SejEvents, SejEventKeys, Commands };
