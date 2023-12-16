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
    },

    /**
     * Check if a given path-like exists on the file system and is a directory.
     *
     * @param p - The path-like to check.
     *
     * @returns `true` if the given path-like exists on the file system and is a
     * directory; `false` otherwise.
     */
    async isDirectory(p: fs.PathLike): Promise<boolean> {
        if (!(await m.exists(p))) {
            return false;
        }
        return (await fsp.stat(p)).isDirectory();
    },

    /**
     * Check if a given path-like exists on the file system and is a symbolic
     * link.
     *
     * @param p - The path-like to check.
     *
     * @returns `true` if the given path-like exists on the file system and is a
     * symbolic link; `false` otherwise.
     */
    async isSymbolicLink(p: fs.PathLike): Promise<boolean> {
        if (!(await m.exists(p))) {
            return false;
        }
        return (await fsp.stat(p)).isSymbolicLink();
    },

    /**
     * Check if a given path-like exists on the file system and is a FIFO pipe.
     *
     * @param p - The path-like to check.
     *
     * @returns `true` if the given path-like exists on the file system and is a
     * FIFO pipe; `false` otherwise.
     */
    async isFIFO(p: fs.PathLike): Promise<boolean> {
        if (!(await m.exists(p))) {
            return false;
        }
        return (await fsp.stat(p)).isFIFO();
    },

    /**
     * Check if a given path-like exists on the file system and is a block
     * device.
     *
     * @param p - The path-like to check.
     *
     * @returns `true` if the given path-like exists on the file system and is a
     * block device; `false` otherwise.
     */
    async isBlockDevice(p: fs.PathLike): Promise<boolean> {
        if (!(await m.exists(p))) {
            return false;
        }
        return (await fsp.stat(p)).isBlockDevice();
    },

    /**
     * Check if a given path-like exists on the file system and is a character
     * device.
     *
     * @param p - The path-like to check.
     *
     * @returns `true` if the given path-like exists on the file system and is a
     * character device; `false` otherwise.
     */
    async isCharacterDevice(p: fs.PathLike): Promise<boolean> {
        if (!(await m.exists(p))) {
            return false;
        }
        return (await fsp.stat(p)).isCharacterDevice();
    },

    /**
     * Check if a given path-like exists on the file system and is a socket.
     *
     * @param p - The path-like to check.
     *
     * @returns `true` if the given path-like exists on the file system and is a
     * socket; `false` otherwise.
     */
    async isSocket(p: fs.PathLike): Promise<boolean> {
        if (!(await m.exists(p))) {
            return false;
        }
        return (await fsp.stat(p)).isSocket();
    }
};

export default m;
