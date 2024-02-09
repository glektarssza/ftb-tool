export {BaseError} from './baseError';
export {ArgumentError} from './argumentError';
export {ArgumentNilError} from './argumentNilError';
export {ArgumentRangeError} from './argumentRangerError';
export {OperationError} from './operationError';
export {StateError} from './stateError';
export {DisposedError} from './disposedError';

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
/* istanbul ignore next */
export function getTestingModule(): typeof m {
    return m;
}

/* eslint-disable no-empty-pattern, @typescript-eslint/unbound-method */
export const {} = m;
/* eslint-enable no-empty-pattern, @typescript-eslint/unbound-method */
