//-- NodeJS
import fs from 'node:fs';
import fsp from 'node:fs/promises';

/**
 * A collection of file system helpers.
 */
const m = {
    /**
     * Check if a given path-like exists on the file system.
     *
     * @param p - The path-like to check for.
     *
     * @returns `true` if the given path-like exists on the file system; `false`
     * otherwise.
     */
    async exists(p: fs.PathLike): Promise<boolean> {
        try {
            await fsp.access(p, fsp.constants.F_OK);
        } catch {
            return false;
        }
        return true;
    },

    /**
     * Check if a given path-like exists on the file system and is a regular
     * file.
     *
     * @param p - The path-like to check.
     *
     * @returns `true` if the given path-like exists on the file system and is a
     * regular file; `false` otherwise.
     */
    async isFile(p: fs.PathLike): Promise<boolean> {
        if (!(await m.exists(p))) {
            return false;
        }
        return (await fsp.stat(p)).isFile();
    }
};

export default m;
