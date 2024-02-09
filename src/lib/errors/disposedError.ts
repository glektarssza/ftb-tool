import {StateError} from './stateError';

/**
 * An error that is produced when an operation is attempted on a
 * {@link Disposable} that has been disposed.
 */
export class DisposedError extends StateError {
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
            objectType,
            operationName,
            message ??
                `Operation "${operationName}" failed (object of type "${objectType}" has been disposed)`,
            inner
        );
    }
}

/**
 * A module which provides an error that can be used when an operation cannot be
 * performed on a {@link Disposable} because it has been disposed.
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
