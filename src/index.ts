import { default as _ } from './Sej';
import { SejEventKeys } from './core/events/types';
import type { SejEvents } from './core/events/types';
/**
 * Sej Engine as singleton.
 */
const Sej = _.Instance;

export default Sej;
export { SejEvents, SejEventKeys };
