import {BaseError} from './baseError';

/**
 * An error that is thrown when an argument is invalid.
 */
export class ArgumentError extends BaseError {
    /**
     * The name of the argument that was invalid.
     */
    public readonly argumentName: string;

    public constructor(argumentName: string, message?: string, inner?: Error) {
        super(message ?? `Invalid argument "${argumentName}"`, inner);
        this.argumentName = argumentName;
    }
}
