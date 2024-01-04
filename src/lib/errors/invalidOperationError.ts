import {BaseError} from './baseError';

/**
 * An error that is thrown when an operation is not valid.
 */
export class InvalidOperationError extends BaseError {
    /**
     * The name of the operation which failed.
     */
    public readonly operationName: string;

    /**
     * Create a new instance.
     *
     * @param operationName - The name of the operation which failed.
     * @param message - A string describing the error that occurred.
     * @param inner - The error that caused the new instance to be thrown.
     */
    public constructor(operationName: string, message?: string, inner?: Error) {
        super(message ?? `Invalid operation "${operationName}"`, inner);
        this.operationName = operationName;
    }
}
