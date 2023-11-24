export * from './logging';
export * from './fs';
export * from './net';

/**
 * Check if a value is `null`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is `null`.
 */
export function isNull(value: unknown): value is null {
    return value === null;
}

/**
 * Check if a value is `undefined`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is `undefined`.
 */
export function isUndefined(value: unknown): value is undefined {
    return value === undefined;
}

/**
 * Check if a value is `null` or `undefined`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is `null` or `undefined`.
 */
export function isNil(value: unknown): value is null | undefined {
    return isNull(value) || isUndefined(value);
}
