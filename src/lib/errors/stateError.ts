import {OperationError} from './operationError';

/**
 * A class which implements a basic error for when an objet is in the wrong
 * state for a requested operation.
 */
export class StateError extends OperationError {
    /**
     * The type of object that was in an invalid state.
     */
    public objectType: string;

    /**
     * Create a new instance.
     *
     * @param objectType - The type of object that was in an invalid state.
     * @param operationName - The name of the operation that failed.
     * @param message - A string describing what went wrong.
     * @param inner - The {@link Error} that caused the new instance to be
     * created.
     */
    public constructor(
        objectType: string,
        operationName: string,
        message?: string,
        inner?: Error
    ) {
        super(
            operationName,
            message ??
                `Operation "${operationName}" failed (object of type "${objectType}" was in an invalid state)`,
            inner
        );
        this.objectType = objectType;
    }
}

/**
 * A module which provides an operation error due to invalid state
 * implementation for the application.
 */
const m = {};

/**
 * Get the internal module for unit testing.
 *
 * @returns The internal module.
 *
 * @internal
 */
export function getTestingModule(): typeof m {
    return m;
}

/* eslint-disable no-empty-pattern, @typescript-eslint/unbound-method */
export const {} = m;
/* eslint-enable no-empty-pattern, @typescript-eslint/unbound-method */
