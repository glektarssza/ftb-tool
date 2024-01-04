import {BaseError} from './baseError';

/**
 * An error that is thrown when an argument is invalid.
 */
export class ArgumentError extends BaseError {
    /**
     * The name of the argument that was invalid.
     */
    public readonly argumentName: string;

    /**
     * Create a new instance.
     *
     * @param argumentName - The name of the argument that was invalid.
     * @param message - A string describing the error that occurred.
     * @param inner - The error that caused the new instance to be thrown.
     */
    public constructor(argumentName: string, message?: string, inner?: Error) {
        super(message ?? `Invalid argument "${argumentName}"`, inner);
        this.argumentName = argumentName;
    }
}
