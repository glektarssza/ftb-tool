import {createHash} from 'node:crypto';
import {constants, PathLike, ReadStream, WriteStream} from 'node:fs';
import {
    access,
    cp,
    CreateReadStreamOptions,
    CreateWriteStreamOptions,
    mkdtemp,
    open,
    rm,
    stat
} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

/**
 * A collection of file system helpers.
 */
const exported = {
    /**
     * Determine whether a path exists.
     *
     * @param path - The path to check.
     *
     * @returns A promise that resolves to whether the path exists.
     */
    exists: async (path: PathLike): Promise<boolean> => {
        try {
            await access(path, constants.F_OK);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Determine whether a path exists and is a file.
     *
     * @param path - The path to check.
     *
     * @returns A promise that resolves to whether the path exists and is a
     * file.
     */
    isFile: async (path: PathLike): Promise<boolean> => {
        if (!(await exported.exists(path))) {
            return false;
        }
        const stats = await stat(path);
        return stats.isFile();
    },

    /**
     * Determine whether a path exists and is a directory.
     *
     * @param path - The path to check.
     *
     * @returns A promise that resolves to whether the path exists and is a
     * directory.
     */
    isDirectory: async (path: PathLike): Promise<boolean> => {
        if (!(await exported.exists(path))) {
            return false;
        }
        const stats = await stat(path);
        return stats.isDirectory();
    },

    /**
     * Determine whether a path exists and is a block device.
     *
     * @param path - The path to check.
     *
     * @returns A promise that resolves to whether the path exists and is a
     * block device.
     */
    isBlockDevice: async (path: PathLike): Promise<boolean> => {
        if (!(await exported.exists(path))) {
            return false;
        }
        const stats = await stat(path);
        return stats.isBlockDevice();
    },

    /**
     * Determine whether a path exists and is a character device.
     *
     * @param path - The path to check.
     *
     * @returns A promise that resolves to whether the path exists and is a
     * character device.
     */
    isCharacterDevice: async (path: PathLike): Promise<boolean> => {
        if (!(await exported.exists(path))) {
            return false;
        }
        const stats = await stat(path);
        return stats.isCharacterDevice();
    },

    /**
     * Determine whether a path exists and is a socket.
     *
     * @param path - The path to check.
     *
     * @returns A promise that resolves to whether the path exists and is a
     * socket.
     */
    isSocket: async (path: PathLike): Promise<boolean> => {
        if (!(await exported.exists(path))) {
            return false;
        }
        const stats = await stat(path);
        return stats.isSocket();
    },

    /**
     * Determine whether a path exists and is a symbolic link.
     *
     * @param path - The path to check.
     *
     * @returns A promise that resolves to whether the path exists and is a
     * symbolic link.
     */
    isSymbolicLink: async (path: PathLike): Promise<boolean> => {
        if (!(await exported.exists(path))) {
            return false;
        }
        const stats = await stat(path);
        return stats.isSymbolicLink();
    },

    /**
     * Determine if a path exists and is a readable file system item.
     *
     * Readable file system items are:
     * * Files
     * * Character devices
     * * Block devices
     * * Sockets
     *
     * @param path - The path to check.
     *
     * @returns A promise hat resolves to whether the path exists and is a
     * readable file system item.
     */
    isReadable: async (path: PathLike): Promise<boolean> => {
        try {
            await access(path, constants.R_OK);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Determine if a path exists and is a writable file system item.
     *
     * Readable file system items are:
     * * Files
     * * Character devices
     * * Block devices
     * * Sockets
     *
     * @param path - The path to check.
     *
     * @returns A promise hat resolves to whether the path exists and is a
     * writable file system item.
     */
    isWritable: async (path: PathLike): Promise<boolean> => {
        try {
            await access(path, constants.W_OK);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Create a readable stream for a given path.
     *
     * @param path - The path to create a readable stream for.
     * @param opts - Any options to use when creating the stream.
     *
     * @returns A promise that resolves to a readable stream on success or
     * rejects if the stream cannot be opened.
     */
    createReadableStream: async (
        path: PathLike,
        opts?: CreateReadStreamOptions
    ): Promise<ReadStream> => {
        if (!(await exported.isReadable(path))) {
            throw new Error(`"${path.toString('utf-8')}" is not readable`);
        }
        const fd = await open(path, 'r');
        return fd.createReadStream(opts);
    },

    /**
     * Create a writable stream for a given path.
     *
     * @param path - The path to create a writable stream for.
     * @param opts - Any options to use when creating the stream.
     *
     * @returns A promise that resolves to a writable stream on success or
     * rejects if the stream cannot be opened.
     */
    createWritableStream: async (
        path: PathLike,
        opts?: CreateWriteStreamOptions
    ): Promise<WriteStream> => {
        if (!(await exported.isWritable(path))) {
            throw new Error(`"${path.toString('utf-8')}" is not writable`);
        }
        const fd = await open(path, 'w');
        return fd.createWriteStream(opts);
    },

    /**
     * Check the integrity of a file.
     *
     * @param path - The path to the file to check the integrity of.
     * @param hash - The hash to check against.
     * @param algo - The hashing algorithm to use.
     *
     * @returns A promise that resolves to `true` if the file exists and has
     * contents that match the provided hash or resolves to `false` if the file
     * does not exist or does not match the provided hash.
     */
    checkFileIntegrity: async (
        path: PathLike,
        hash: string,
        algo = 'sha1'
    ): Promise<boolean> => {
        if (!(await exported.isFile(path))) {
            return false;
        }
        const digester = createHash(algo);
        const is = await exported.createReadableStream(path);
        is.pipe(digester);
        const fileHash = digester.digest('hex');
        is.close();
        return fileHash === hash;
    },

    /**
     * Create a temporary directory.
     *
     * @param root - The root directory inside of which to create a temporary
     * directory.
     * @param prefix - The prefix to apply to the temporary directory.
     *
     * @returns A promise that resolves to the full path to the new temporary
     * directory on success or rejects on an error.
     */
    createTempDirectory: async (
        root: PathLike,
        prefix: string
    ): Promise<PathLike> => {
        if (!(await exported.isDirectory(root))) {
            throw new Error(
                `Cannot create a temporary directory in "${root.toString(
                    'utf-8'
                )}", not a directory`
            );
        }
        const fullPrefix = path.join(root.toString('utf-8'), prefix);
        return mkdtemp(fullPrefix, 'utf-8');
    },

    /**
     * Create a temporary directory in the temporary directory for the operating
     * system.
     *
     * @param prefix - The prefix to apply to the temporary directory.
     *
     * @returns A promise that resolves to the full path to the new temporary
     * directory on success or rejects on an error.
     */
    createOSTempDirectory: async (prefix: string): Promise<PathLike> => {
        const osTempDir = tmpdir();
        return exported.createTempDirectory(osTempDir, prefix);
    },

    /**
     * Remove a file.
     *
     * @param path - The path to the file to remove.
     * @param force - Whether to forcefully remove the file.
     *
     * @returns A promise that resolves once the operation is completed or
     * rejects if an error occurs.
     */
    removeFile: async (path: PathLike, force = false): Promise<void> => {
        if (!(await exported.isFile(path))) {
            throw new Error(`"${path.toString('utf-8')}" is not a file`);
        }
        await rm(path, {
            recursive: false,
            force
        });
    },

    /**
     * Remove a directory.
     *
     * @param path - The path to the directory to remove.
     * @param force - Whether to forcefully remove the directory.
     *
     * @returns A promise that resolves once the operation is completed or
     * rejects if an error occurs.
     */
    removeDirectory: async (path: PathLike, force = false): Promise<void> => {
        if (!(await exported.isDirectory(path))) {
            throw new Error(`"${path.toString('utf-8')}" is not a directory`);
        }
        await rm(path, {
            recursive: true,
            force
        });
    },

    /**
     * Copy a file to another location.
     *
     * @param source - The source file to copy.
     * @param destination - The location to copy the source to.
     * @param force - Whether to forcefully copy.
     *
     * @returns A promise that resolves once the operation is completed or
     * rejects if an error occurs.
     */
    copyFile: async (
        source: PathLike,
        destination: PathLike,
        force = false
    ): Promise<void> => {
        if (!(await exported.isFile(source))) {
            throw new Error(`"${source.toString('utf-8')}" is not a file`);
        }
        if (
            (await exported.exists(destination)) &&
            !(await exported.isDirectory(destination)) &&
            !force
        ) {
            throw new Error(
                `"${destination.toString('utf-8')}" already exists`
            );
        }
        await cp(source.toString('utf-8'), destination.toString('utf-8'), {
            recursive: false,
            force
        });
    },

    /**
     * Copy a directory and all its contents to another location.
     *
     * @param source - The source directory to copy.
     * @param destination - The location to copy the source to.
     * @param force - Whether to forcefully copy.
     *
     * @returns A promise that resolves once the operation is completed or
     * rejects if an error occurs.
     */
    copyDirectory: async (
        source: PathLike,
        destination: PathLike,
        force = false
    ): Promise<void> => {
        if (!(await exported.isDirectory(source))) {
            throw new Error(`"${source.toString('utf-8')}" is not a directory`);
        }
        if (await exported.exists(destination)) {
            if (await exported.isFile(destination)) {
                throw new Error(
                    `"${destination.toString(
                        'utf-8'
                    )}" already exists and is a file`
                );
            } else if (!force) {
                throw new Error(
                    `"${destination.toString('utf-8')}" already exists`
                );
            }
        }
        await cp(source.toString('utf-8'), destination.toString('utf-8'), {
            recursive: true,
            force
        });
    }
};

export = exported;
