//-- Project Code
import {ArgumentError} from './argumentError';
/**
 * An error that is produced when an argument is not one of the available
 * choices.
 */
export class ArgumentChoicesError<T> extends ArgumentError {
    /**
     * The actual value of the argument that was invalid.
     */
    public readonly actualValue: T;

    /**
     * A list of valid choices for the argument that was invalid.
     */
    public readonly argumentChoices: T[];

    /**
     * Create a new instance.
     *
     * @param actualValue - The actual value of the argument that was invalid.
     * @param argumentChoices - A list of valid choices for the argument that
     * was invalid.
     * @param argumentName - The name of the argument that was invalid.
     * @param message - A string describing what went wrong.
     * @param inner - The {@link Error} that caused the new instance to be
     * created.
     */
    public constructor(
        actualValue: T,
        argumentChoices: T[],
        argumentName: string,
        message?: string,
        inner?: Error
    ) {
        super(
            argumentName,
            message ??
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `Invalid argument "${argumentName}" (value "${actualValue}" not one of "[${argumentChoices.join(
                    ', '
                )}]")`,
            inner
        );
        this.actualValue = actualValue;
        this.argumentChoices = argumentChoices;
    }
}

/**
 * A module which provides an error implementation for the application for when
 * an argument is not one of the available choices.
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
