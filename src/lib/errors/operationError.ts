import {BaseError} from './baseError';

/**
 * A class which implements a basic error for when an operation fails.
 */
export class OperationError extends BaseError {
    /**
     * The name of the operation that failed.
     */
    public readonly operationName: string;

    /**
     * Create a new instance.
     *
     * @param operationName - The name of the operation that failed.
     * @param message - A string describing what went wrong.
     * @param inner - The {@link Error} that caused the new instance to be
     * created.
     */
    public constructor(operationName: string, message?: string, inner?: Error) {
        super(message ?? `Operation "${operationName}" failed`, inner);
        this.operationName = operationName;
    }
}

/**
 * A module which provides an operation error implementation for the
 * application.
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
