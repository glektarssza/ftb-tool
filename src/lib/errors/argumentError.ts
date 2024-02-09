import {BaseError} from './baseError';

/**
 * A class which implements a basic error for when arguments are invalid.
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
     * @param message - A string describing what went wrong.
     * @param inner - The {@link Error} that caused the new instance to be
     * created.
     */
    public constructor(argumentName: string, message?: string, inner?: Error) {
        super(message ?? `Invalid argument "${argumentName}"`, inner);
        this.argumentName = argumentName;
    }
}
