/**
 * A class that implements a basic error type for other errors to extend from.
 */
export class BaseError extends Error {
    /**
     * The {@link Error} that caused this instance to be created.
     */
    public readonly inner?: Error;

    /**
     * Create a new instance.
     *
     * @param message - A string describing what went wrong.
     * @param inner - The {@link Error} that caused the new instance to be
     * created.
     */
    public constructor(message?: string, inner?: Error) {
        super(message);
        this.name = this.constructor.name ?? 'Error';
        this.inner = inner;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * A module which provides a base error implementation for the application.
 */
const m = {
    // TODO: Any helper functions for overriding `prepareStackTrace`
};

// TODO: Override `prepareStackTrace`

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
