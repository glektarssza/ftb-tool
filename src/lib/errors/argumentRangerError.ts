//-- Project Code
import {ArgumentError} from './argumentError';

/**
 * An error that is produced when an argument is outside of the allowed range of
 * values.
 */
export class ArgumentRangeError<T> extends ArgumentError {
    /**
     * The actual value of the argument that was invalid.
     */
    public readonly actualValue: T;

    /**
     * The minimum allowed value of the argument that was invalid.
     */
    public readonly minimumValue: T;

    /**
     * The maximum allowed value of the argument that was invalid.
     */
    public readonly maximumValue: T;

    /**
     * Create a new instance.
     *
     * @param actualValue - The actual value of the argument that was invalid.
     * @param minimumValue - The minimum allowed value of the argument that was
     * invalid.
     * @param maximumValue - The maximum allowed value of the argument that was
     * invalid.
     * @param argumentName - The name of the argument that was invalid.
     * @param message - A string describing what went wrong.
     * @param inner - The {@link Error} that caused the new instance to be
     * created.
     */
    public constructor(
        actualValue: T,
        minimumValue: T,
        maximumValue: T,
        argumentName: string,
        message?: string,
        inner?: Error
    ) {
        super(
            argumentName,
            message ??
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `Invalid argument "${argumentName}" (value "${actualValue}" outside allowed range of "${minimumValue}" to "${maximumValue}")`,
            inner
        );
        this.actualValue = actualValue;
        this.minimumValue = minimumValue;
        this.maximumValue = maximumValue;
    }
}

/**
 * A module which provides an argument error implementation for the
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
/* istanbul ignore next */
export function getTestingModule(): typeof m {
    return m;
}

/* eslint-disable no-empty-pattern, @typescript-eslint/unbound-method */
export const {} = m;
/* eslint-enable no-empty-pattern, @typescript-eslint/unbound-method */
