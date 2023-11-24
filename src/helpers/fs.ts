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

/**
 * Check the integrity of a file.
 *
 * @param path - The path to the file to check the integrity of.
 * @param hash - The hash to check against.
 * @param algo - The hashing algorithm to use.
 *
 * @returns A promise that resolves to `true` if the file exists and has
 * contents that match the provided hash or resolves to `false` if the file does
 * not exist or does not match the provided hash.
 */
export async function checkFileIntegrity(
    path: PathLike,
    hash: string,
    algo = 'sha1'
): Promise<boolean> {
    if (!(await isFile(path))) {
        return false;
    }
    const digester = createHash(algo);
    const is = await createReadableStream(path);
    is.pipe(digester);
    const fileHash = digester.digest('hex');
    is.close();
    return fileHash === hash;
}

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
export async function createTempDirectory(
    root: PathLike,
    prefix: string
): Promise<PathLike> {
    if (!(await isDirectory(root))) {
        throw new Error(
            `Cannot create a temporary directory in "${root.toString(
                'utf-8'
            )}", not a directory`
        );
    }
    const fullPrefix = path.join(root.toString('utf-8'), prefix);
    return mkdtemp(fullPrefix, 'utf-8');
}

/**
 * Create a temporary directory in the temporary file system for the operating
 * system.
 *
 * @param prefix - The prefix to apply to the temporary directory.
 *
 * @returns A promise that resolves to the full path to the new temporary
 * directory on success or rejects on an error.
 */
export async function createOSTempDirectory(prefix: string): Promise<PathLike> {
    const osTempDir = tmpdir();
    return createTempDirectory(osTempDir, prefix);
}

/**
 * Remove a file.
 *
 * @param path - The path to the file to remove.
 * @param force - Whether to forcefully remove the file.
 *
 * @returns A promise that resolves once the operation is completed or rejects
 * if an error occurs.
 */
export async function removeFile(path: PathLike, force = false): Promise<void> {
    if (!(await isFile(path))) {
        throw new Error(`"${path.toString('utf-8')}" is not a file`);
    }
    await rm(path, {
        recursive: false,
        force
    });
}

/**
 * Remove a directory.
 *
 * @param path - The path to the directory to remove.
 * @param force - Whether to forcefully remove the directory.
 *
 * @returns A promise that resolves once the operation is completed or rejects
 * if an error occurs.
 */
export async function removeDirectory(
    path: PathLike,
    force = false
): Promise<void> {
    if (!(await isDirectory(path))) {
        throw new Error(`"${path.toString('utf-8')}" is not a directory`);
    }
    await rm(path, {
        recursive: true,
        force
    });
}

/**
 * Copy a file to another location.
 *
 * @param source - The source file to copy.
 * @param destination - The location to copy the source to.
 * @param force - Whether to forcefully copy.
 *
 * @returns A promise that resolves once the operation is completed or rejects
 * if an error occurs.
 */
export async function copyFile(
    source: PathLike,
    destination: PathLike,
    force = false
): Promise<void> {
    if (!(await isFile(source))) {
        throw new Error(`"${source.toString('utf-8')}" is not a file`);
    }
    if (await exists(destination)) {
        throw new Error(`"${destination.toString('utf-8')}" already exists`);
    }
    await cp(source.toString('utf-8'), destination.toString('utf-8'), {
        recursive: false,
        force
    });
}

/**
 * Copy a directory and all its contents to another location.
 *
 * @param source - The source directory to copy.
 * @param destination - The location to copy the source to.
 * @param force - Whether to forcefully copy.
 *
 * @returns A promise that resolves once the operation is completed or rejects
 * if an error occurs.
 */
export async function copyDirectory(
    source: PathLike,
    destination: PathLike,
    force = false
): Promise<void> {
    if (!(await isDirectory(source))) {
        throw new Error(`"${source.toString('utf-8')}" is not a directory`);
    }
    if (await exists(destination)) {
        throw new Error(`"${destination.toString('utf-8')}" already exists`);
    }
    await cp(source.toString('utf-8'), destination.toString('utf-8'), {
        recursive: true,
        force
    });
}
