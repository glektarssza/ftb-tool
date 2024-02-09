/**
 * An interface for objects that manage some kind of resource and must release
 * them before being considered for garbage collection.
 */
export interface Disposable {
    /**
     * Whether this instance has been disposed.
     */
    readonly isDisposed: boolean;

    /**
     * Dispose of this instance and any resources it is managing.
     *
     * This method should, if at all possible, not throw any errors.
     */
    dispose(): boolean;
}

/**
 * A module which provides an interface for objects that must be disposed to
 * release some kind of managed resource.
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
