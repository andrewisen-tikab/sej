import { AbstractCommand } from './AbstractCommand';

/**
 * Represents an empty command that extends the functionality of AbstractCommand.
 * This class can be used as a placeholder or base class for other commands.
 *
 * It can also be used for serialization and deserialization of commands.
 * Note that the constructor of this class does not take any arguments.
 *
 * An empty command should be can always be created from thin air.
 */
export class EmptyCommand extends AbstractCommand {}
