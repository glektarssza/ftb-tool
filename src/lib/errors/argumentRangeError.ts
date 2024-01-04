import {ArgumentError} from './argumentError';

/**
 * An error that is thrown when an argument is outside of the allowed value
 * range.
 */
export class ArgumentRangeError<T> extends ArgumentError {
    /**
     * The actual value of the argument.
     */
    public readonly actualValue: T;

    /**
     * The minimum allowed value of the argument.
     */
    public readonly minimumValue: T;

    /**
     * The maximum allowed value of the argument.
     */
    public readonly maximumValue: T;

    /**
     * Create a new instance.
     *
     * @param actualValue - The actual value of the argument.
     * @param minimumValue - The minimum allowed value of the argument.
     * @param maximumValue - The maximum allowed value of the argument.
     * @param argumentName - The name of the argument that was invalid.
     * @param message - A string describing the error that occurred.
     * @param inner - The error that caused the new instance to be thrown.
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
                `Invalid argument "${argumentName}" (value "${actualValue}" is outside allowed range of "${minimumValue}" to "${maximumValue}")`,
            inner
        );
        this.actualValue = actualValue;
        this.minimumValue = minimumValue;
        this.maximumValue = maximumValue;
    }
}
