import {ArgumentError} from './argumentError';

/**
 * An error that is produced when an argument is `null` or `undefined`.
 */
export class ArgumentNilError extends ArgumentError {
    /**
     * Create a new instance.
     *
     * @param argumentName - The name of the argument that was invalid.
     * @param message - A string describing what went wrong.
     * @param inner - The {@link Error} that caused the new instance to be
     * created.
     */
    public constructor(argumentName: string, message?: string, inner?: Error) {
        super(
            argumentName,
            message ?? `Invalid argument "${argumentName}" (null or undefined)`,
            inner
        );
    }
}

/**
 * A module which provides an error implementation for the application for when
 * an argument is `null` or `undefined`.
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
