import {InvalidOperationError} from './invalidOperationError';

/**
 * An error that is thrown when an object is in an invalid state for the
 * requested operation.
 */
export class InvalidStateError extends InvalidOperationError {
    /**
     * The type of object that was in an invalid state.
     */
    public readonly objectType: string;

    /**
     * Create a new instance.
     *
     * @param objectType - The type of object that was in an invalid state.
     * @param operationName - The name of the operation which failed.
     * @param message - A string describing the error that occurred.
     * @param inner - The error that caused the new instance to be thrown.
     */
    public constructor(
        objectType: string,
        operationName: string,
        message?: string,
        inner?: Error
    ) {
        super(operationName, message, inner);
        this.objectType = objectType;
    }
}
