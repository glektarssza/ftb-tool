export {BaseError} from './baseError';
export {ArgumentError} from './argumentError';

/**
 * A module which provides custom error implementations for the application.
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
