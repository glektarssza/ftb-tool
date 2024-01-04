import {ArgumentError} from './argumentError';

/**
 * An error that is thrown when an argument is `null` or `undefined` when it
 * should not have been.
 */
export class ArgumentNilError extends ArgumentError {
    /**
     * Create new instance.
     *
     * @param argumentName - The name of the argument that was invalid.
     * @param message - A string describing the error that occurred.
     * @param inner - The error that caused the new instance to be thrown.
     */
    public constructor(argumentName: string, message?: string, inner?: Error) {
        super(
            argumentName,
            message ?? `Invalid argument "${argumentName}" (null or undefined)`,
            inner
        );
    }
}
