import fs from './fs';
import * as logging from './logging';
import * as net from './net';

const exported = {
    ...fs,
    ...logging,
    ...net,
    /**
     * Check if a value is `null`.
     *
     * @param value - The value to check.
     *
     * @returns Whether the value is `null`.
     */
    isNull: (value: unknown): value is null => {
        return value === null;
    },

    /**
     * Check if a value is `undefined`.
     *
     * @param value - The value to check.
     *
     * @returns Whether the value is `undefined`.
     */
    isUndefined: (value: unknown): value is undefined => {
        return value === undefined;
    },

    /**
     * Check if a value is `null` or `undefined`.
     *
     * @param value - The value to check.
     *
     * @returns Whether the value is `null` or `undefined`.
     */
    isNil: (value: unknown): value is null | undefined => {
        return exported.isNull(value) || exported.isUndefined(value);
    }
};

export = exported;
