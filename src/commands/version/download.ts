import path from 'node:path';
import {Readable} from 'node:stream';
import {cwd} from 'node:process';
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
import {ModpackVersionManifest, ModpackVersionFile} from '../../types';
import {
    checkFileIntegrity,
    copyDirectory,
    createOSTempDirectory,
    createWritableStream,
    isFile,
    removeDirectory,
    removeFile
} from '../../helpers/fs';
import {isNil} from '../../helpers';

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

/**
 * Check if a file should be downloaded.
 *
 * @param args - The command-line options.
 * @param file - The file to check.
 *
 * @returns A promise that resolves to `true` if the file should be downloaded
 * again or `false` if the file is okay on the local disk.
 */
async function shouldDownloadFile(
    args: DownloadCLIOptions,
    file: ModpackVersionFile
): Promise<boolean> {
    const tempOutputPath = path.join(args.tempPath, file.path, file.name);
    const exists = await isFile(tempOutputPath);
    if (exists && args.checkIntegrity) {
        return !(await checkFileIntegrity(tempOutputPath, file.sha1));
    }
    return !exists;
}

async function process(args: DownloadCLIOptions): Promise<void> {
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
    const clientFiles = data.files.filter((file) => !file.serveronly);
    const filesToDownload = (
        await Promise.all(
            clientFiles.map(async (file) => {
                if (await shouldDownloadFile(args, file)) {
                    return file;
                }
                return null;
            })
        )
    ).filter((file): file is ModpackVersionFile => !isNil(file));
    logger.info(`Downloading ${filesToDownload.length} files...`);
    const downloads = filesToDownload.map(async (file) => {
        const tempOutputPath = path.join(args.tempPath, file.path, file.name);
        logger.info(`Downloading "${file.name}" to "${tempOutputPath}"...`);
        if (await isFile(tempOutputPath)) {
            await removeFile(tempOutputPath);
        }
        const os = await createWritableStream(tempOutputPath);
        let is: Readable;
        if (file.curseforge) {
            is = await getFlameFile(
                file.curseforge.project,
                file.curseforge.file
            );
        } else {
            is = await getFTBFile(file.url);
        }
        await new Promise<void>((resolve, reject) => {
            is.addListener('end', resolve).addListener('error', reject);
            is.pipe(os);
        }).finally(() => {
            os.close();
        });
    });
    //-- Wait for all downloads to complete
    await Promise.all(downloads);
    if (args.archive === ArchiveType.None) {
        logger.info(`Copying "${args.tempPath}" to "${finalDestination}"...`);
        await copyDirectory(args.tempPath, finalDestination);
    } else {
        // TODO: Archive files
    }
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
                default: cwd(),
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
        if (args.tempPath === '') {
            args.tempPath = (await createOSTempDirectory('ftb-tool-')).toString(
                'utf-8'
            );
        }
        try {
            await process(args);
        } finally {
            if (args.cleanupTemp) {
                await removeDirectory(args.tempPath);
            }
        }
    }
};
