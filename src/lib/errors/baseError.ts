/**
 * A base error type for other errors to extend from.
 */
export class BaseError extends Error {
    /**
     * The error that caused this instance to be thrown.
     */
    public readonly inner?: Error | undefined;

    /**
     * Create a new instance.
     *
     * @param message - A string describing the error that occurred.
     * @param inner - The error that caused the new instance to be thrown.
     */
    public constructor(message?: string, inner?: Error) {
        super(message);
        this.name = this.constructor.name;
        this.inner = inner;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
