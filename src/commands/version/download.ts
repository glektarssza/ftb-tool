import path from 'node:path';
import {Readable} from 'node:stream';
import {CommandModule} from 'yargs';
import {setVerbose, Logger} from '../../helpers/logging';
import {
    getFTB,
    setRequestTimeout,
    setFlameAPIKey,
    setRequestLimit,
    setUserAgent,
    getFlameFile,
    getFTBFile
} from '../../helpers/net';
import {VersionCLIOptions} from '.';
import {ModpackVersionManifest} from '../../types';
import {
    createReadableStream,
    createWritableStream,
    isFile
} from '../../helpers';
import {AxiosError} from 'axios';
import {createHash} from 'node:crypto';
import {copyFile, mkdir, rm, unlink} from 'node:fs/promises';

/**
 * The logger for this module.
 */
const logger = new Logger('command:version:download');

/**
 * A list of supported archive formats.
 */
export enum ArchiveType {
    /**
     * Do not create an archive.
     */
    None = 'none',

    /**
     * A `.zip` archive.
     */
    Zip = 'zip',

    /**
     * A `.tar` archive.
     *
     * Does not support compression.
     */
    Tar = 'tar',

    /**
     * A `.tar` file compressed with `gzip`.
     */
    TarGzip = 'tar.gz'
}

/**
 * The command-line options for the `version download` sub-command.
 */
export interface DownloadCLIOptions extends VersionCLIOptions {
    /**
     * The ID of the modpack to get information for.
     */
    modpackId: number;

    /**
     * The ID of the modpack version to get information for.
     */
    versionId: number;

    /**
     * The location to store the modpack version file(s) in.
     *
     * Defaults to the current working directory if `archive` is set or a folder
     * called `ftb-{MODPACK_ID}` if `archive` is not set.
     */
    outputDir: string;

    /**
     * Whether to package the modpack version files into a single archive.
     *
     * Defaults to `None`.
     */
    archive: ArchiveType;

    /**
     * The amount of compression to apply to the generated archive.
     *
     * The value should be between `0` and `9` where `0` means no compression
     * and `9` means the highest compression.
     *
     * Only respected if `archive` is set to an archive type that supports
     * compression.
     *
     * Defaults to `0` or no compression.
     */
    compression: number;

    /**
     * The maximum number of times to attempt to grab a given file.
     *
     * Defaults to `3`.
     */
    perFileRetries: number;

    /**
     * Whether to check the integrity of a file after downloading.
     *
     * Defaults to `true`.
     */
    checkIntegrity: boolean;

    /**
     * Overwrite existing files in the output directory.
     *
     * Defaults to `false`.
     */
    overwriteExisting: boolean;

    /**
     * The path to a temporary directory into which to stage downloaded files.
     *
     * Defaults to a randomly generated directory inside the operating system
     * temporary file system.
     */
    tempPath: string;

    /**
     * Whether to clean up the temporary directory when the program exits.
     *
     * Defaults to `true`.
     */
    cleanupTemp: boolean;
}

export const command: CommandModule<VersionCLIOptions, DownloadCLIOptions> = {
    command: 'download <modpackId> <versionId>',
    describe: 'Download a given version of a given modpack.',
    builder(yargs) {
        return yargs
            .positional('modpackId', {
                type: 'number',
                description: 'The ID of the modpack to get information for.',
                demandOption: true
            })
            .positional('versionId', {
                type: 'number',
                description:
                    'The ID of the modpack version to get information for.',
                demandOption: true
            })
            .option('outputDir', {
                type: 'string',
                description: 'The location to store the downloaded file(s) in.',
                default: process.cwd(),
                defaultDescription:
                    'The current working directory if "archive" is set, a directory named "ftb-{MODPACK_ID}" otherwise.',
                normalize: true
            })
            .option('archive', {
                type: 'string',
                description: 'The type of archive to create, if any.',
                choices: [
                    ArchiveType.None,
                    ArchiveType.Tar,
                    ArchiveType.TarGzip,
                    ArchiveType.Zip
                ],
                default: ArchiveType.None
            })
            .option('compression', {
                type: 'number',
                description:
                    'The amount of compression to apply to the generated archive.',
                defaultDescription: 'No compression.',
                default: 0
            })
            .option('perFileRetries', {
                type: 'number',
                description:
                    'The maximum number of times to try downloading a file if it fails.',
                default: 3
            })
            .option('checkIntegrity', {
                type: 'boolean',
                description:
                    'Whether to validate the integrity of files after they are downloaded.',
                default: true
            })
            .option('overwriteExisting', {
                type: 'boolean',
                description:
                    'Whether to overwrite existing files in the output directory.',
                default: false
            })
            .option('tempPath', {
                type: 'string',
                description:
                    'The location to stage downloaded files in prior to outputting them to the output path.',
                default: '',
                defaultDescription:
                    'A randomly created directory in the operating system temporary file system.',
                normalize: true
            })
            .option('cleanupTemp', {
                type: 'boolean',
                description:
                    'Whether to delete the temporary directory after the program runs.',
                default: true
            });
    },
    async handler(args) {
        setVerbose(args.verbose);
        if (args.verbose) {
            logger.verbose('Verbose logging enabled');
        }
        setRequestTimeout(args.timeout);
        setRequestLimit(args.maxConnections);
        if (args.curseForgeAPIKey) {
            setFlameAPIKey(args.curseForgeAPIKey);
        }
        if (args.userAgent) {
            setUserAgent(args.userAgent);
        }
        const isArchive = args.archive !== ArchiveType.None;
        const finalDestination = path.join(
            args.outputDir,
            `ftb-${args.modpackId}-${args.versionId}`,
            isArchive ? `.${args.archive}` : ''
        );
        logger.info(
            `Downloading modpack with ID "${args.modpackId}", version with ID "${args.versionId}"`
        );
        const data = await getFTB<ModpackVersionManifest>(
            `/modpack/${args.modpackId}/${args.versionId}`
        );
        logger.info(`Downloading ${data.files.length} files...`);
        try {
            const downloads = data.files.map(async (file) => {
                if (file.serveronly) {
                    return;
                }
                if (!isArchive) {
                    //-- Check whether file already exists in output path
                    const fullPath = path.join(
                        args.outputDir,
                        file.path,
                        file.name
                    );
                    if (await isFile(fullPath)) {
                        if (args.checkIntegrity) {
                            const hasher = createHash('sha1');
                            (await createReadableStream(fullPath)).pipe(hasher);
                            const existingHash = hasher.digest('hex');
                            if (existingHash === file.sha1) {
                                logger.warn(
                                    `File "${path.join(
                                        file.path,
                                        file.name
                                    )}" exists and passed integrity check, skipping`
                                );
                                return;
                            } else {
                                logger.warn(
                                    `File "${path.join(
                                        file.path,
                                        file.name
                                    )}" exists but failed integrity check, downloading again`
                                );
                            }
                        } else {
                            logger.warn(
                                `Skipping check of hash for "${path.join(
                                    file.path,
                                    file.name
                                )}"`
                            );
                            //-- File exists and is okay, skip it
                            logger.info(
                                `File "${path.join(
                                    file.path,
                                    file.name
                                )}" exists, skipping`
                            );
                            return;
                        }
                        await unlink(fullPath);
                    }
                }
                const outputPath = path.join(
                    args.tempPath,
                    file.path,
                    file.name
                );
                const os = await createWritableStream(outputPath);
                let is: Readable;
                if (file.curseforge) {
                    is = await getFlameFile(
                        file.curseforge.project,
                        file.curseforge.file
                    );
                } else if (file.url) {
                    try {
                        is = await getFTBFile(file.url);
                    } catch (ex) {
                        if (ex instanceof AxiosError) {
                            if (ex.status === 404) {
                                logger.warn(
                                    `Got 404 for "${path.join(
                                        file.path,
                                        file.name
                                    )}", skipping`
                                );
                                return;
                            }
                        }
                        throw ex;
                    }
                } else {
                    os.close();
                    throw new Error(
                        `Cannot download "${path.join(
                            file.path,
                            file.name
                        )}", no URL`
                    );
                }
                let tries = args.perFileRetries;
                do {
                    tries--;
                    try {
                        await new Promise<void>((resolve, reject) => {
                            is.addListener('error', (err) => {
                                reject(err);
                            });
                            is.addListener('end', () => {
                                resolve();
                            });
                            is.pipe(os);
                        }).finally(() => {
                            os.close();
                        });
                    } catch (ex) {
                        await unlink(outputPath);
                        logger.warn(
                            `Failed to download "${path.join(
                                file.path,
                                file.name
                            )}", retrying up to ${tries} more time${
                                tries === 1 ? '' : 's'
                            }...`
                        );
                        continue;
                    }
                    break;
                } while (tries > 0);
                if (!(await isFile(outputPath))) {
                    throw new Error(
                        `Failed to download "${path.join(
                            file.path,
                            file.name
                        )}", aborting`
                    );
                }
            });
            await Promise.all(downloads);
            if (!isArchive) {
                await mkdir(finalDestination, {
                    recursive: true
                });
                const copies = data.files.map(async (file) => {
                    return copyFile(
                        path.join(args.tempPath, file.path, file.name),
                        path.join(finalDestination, file.path, file.name)
                    );
                });
                await Promise.all(copies);
            }
        } finally {
            //-- Last thing we do is cleanup if asked to
            if (args.cleanupTemp) {
                await rm(args.tempPath, {
                    recursive: true
                });
            }
        }
    }
};
