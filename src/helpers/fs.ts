import {constants, PathLike, ReadStream, WriteStream} from 'node:fs';
import {
    access,
    CreateReadStreamOptions,
    CreateWriteStreamOptions,
    open,
    stat
} from 'node:fs/promises';

/**
 * Determine whether a path exists.
 *
 * @param path - The path to check.
 *
 * @returns A promise that resolves to whether the path exists.
 */
export async function exists(path: PathLike): Promise<boolean> {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

/**
 * Determine whether a path exists and is a file.
 *
 * @param path - The path to check.
 *
 * @returns A promise that resolves to whether the path exists and is a file.
 */
export async function isFile(path: PathLike): Promise<boolean> {
    if (!(await exists(path))) {
        return false;
    }
    const stats = await stat(path);
    return stats.isFile();
}

/**
 * Determine whether a path exists and is a directory.
 *
 * @param path - The path to check.
 *
 * @returns A promise that resolves to whether the path exists and is a directory.
 */
export async function isDirectory(path: PathLike): Promise<boolean> {
    if (!(await exists(path))) {
        return false;
    }
    const stats = await stat(path);
    return stats.isDirectory();
}

/**
 * Determine whether a path exists and is a block device.
 *
 * @param path - The path to check.
 *
 * @returns A promise that resolves to whether the path exists and is a block
 * device.
 */
export async function isBlockDevice(path: PathLike): Promise<boolean> {
    if (!(await exists(path))) {
        return false;
    }
    const stats = await stat(path);
    return stats.isBlockDevice();
}

/**
 * Determine whether a path exists and is a character device.
 *
 * @param path - The path to check.
 *
 * @returns A promise that resolves to whether the path exists and is a
 * character device.
 */
export async function isCharacterDevice(path: PathLike): Promise<boolean> {
    if (!(await exists(path))) {
        return false;
    }
    const stats = await stat(path);
    return stats.isCharacterDevice();
}

/**
 * Determine whether a path exists and is a socket.
 *
 * @param path - The path to check.
 *
 * @returns A promise that resolves to whether the path exists and is a socket.
 */
export async function isSocket(path: PathLike): Promise<boolean> {
    if (!(await exists(path))) {
        return false;
    }
    const stats = await stat(path);
    return stats.isSocket();
}

/**
 * Determine whether a path exists and is a symbolic link.
 *
 * @param path - The path to check.
 *
 * @returns A promise that resolves to whether the path exists and is a symbolic
 * link.
 */
export async function isSymbolicLink(path: PathLike): Promise<boolean> {
    if (!(await exists(path))) {
        return false;
    }
    const stats = await stat(path);
    return stats.isSymbolicLink();
}

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
 * @returns A promise hat resolves to whether the path exists and is a readable
 * file system item.
 */
export async function isReadable(path: PathLike): Promise<boolean> {
    return (
        (await isBlockDevice(path)) ||
        (await isCharacterDevice(path)) ||
        (await isFile(path)) ||
        (await isSocket(path))
    );
}

/**
 * Create a readable stream for a given path.
 *
 * @param path - The path to create a readable stream for.
 * @param opts - Any options to use when creating the stream.
 *
 * @returns A promise that resolves to a readable stream on success or rejects
 * if the stream cannot be opened.
 */
export async function createReadableStream(
    path: PathLike,
    opts?: CreateReadStreamOptions
): Promise<ReadStream> {
    const fd = await open(path, 'r');
    return fd.createReadStream(opts);
}

/**
 * Create a writable stream for a given path.
 *
 * @param path - The path to create a writable stream for.
 * @param opts - Any options to use when creating the stream.
 *
 * @returns A promise that resolves to a writable stream on success or rejects
 * if the stream cannot be opened.
 */
export async function createWritableStream(
    path: PathLike,
    opts?: CreateWriteStreamOptions
): Promise<WriteStream> {
    const fd = await open(path, 'w');
    return fd.createWriteStream(opts);
}
