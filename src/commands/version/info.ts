import {CommandModule} from 'yargs';
import {setVerbose, Logger} from '../../helpers/logging';
import {createWritableStream} from '../../helpers/fs';
import {
    getFTB,
    setRequestTimeout,
    setFlameAPIKey,
    setRequestLimit,
    setUserAgent
} from '../../helpers/net';
import {Writable} from 'stream';
import {VersionCLIOptions} from '.';
import {ModpackVersionManifest} from '../../types';

/**
 * The logger for this module.
 */
const logger = new Logger('command:version:info');

/**
 * The command-line options for the `version info` sub-command.
 */
export interface InfoCLIOptions extends VersionCLIOptions {
    /**
     * The ID of the modpack to get information for.
     */
    modpackId: number;

    /**
     * The ID of the modpack version to get information for.
     */
    versionId: number;

    /**
     * Whether to output results as JSON.
     *
     * Defaults to `false`.
     */
    json: boolean;

    /**
     * Whether to format JSON results in a human-readable way.
     *
     * Only valid when `json` is `true`.
     *
     * Defaults to `false`.
     */
    pretty: boolean;

    /**
     * The file to output the results to or `-` for `stdout`.
     *
     * Defaults to `stdout`.
     */
    output: string;
}

/**
 * The `version info` sub-command.
 */
export const command: CommandModule<VersionCLIOptions, InfoCLIOptions> = {
    command: 'info <modpackId> <versionId>',
    describe: 'Get the information for a Feed the Beast modpack version.',
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
            .option('json', {
                type: 'boolean',
                description: 'Whether to output the results as JSON.',
                default: false
            })
            .option('pretty', {
                type: 'boolean',
                description: 'Whether pretty format the JSON output.',
                default: false
            })
            .option('output', {
                type: 'string',
                description: 'The location to output the results to.',
                defaultDescription: 'stdout',
                default: '-',
                normalize: true
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
        logger.info(
            `Getting information for modpack with ID ${args.modpackId}, version with ID "${args.versionId}"`
        );
        const data = await getFTB<ModpackVersionManifest>(
            `/modpack/${args.modpackId}/${args.versionId}`
        );
        let os: Writable = process.stdout;
        if (args.output !== '-') {
            os = await createWritableStream(args.output);
        }
        os.setDefaultEncoding('utf-8');
        if (args.json) {
            let outputData: string;
            if (args.pretty) {
                outputData = JSON.stringify(data, undefined, 4);
            } else {
                outputData = JSON.stringify(data);
            }
            os.write(`${outputData}\n`);
        } else {
            os.write(`${data.name}\n`);
            os.write(`-------------------------\n`);
            os.write('\n');
            // os.write(`${data.synopsis}\n`);
            // os.write('\n');
            os.write(`ID: ${data.id}\n`);
            // os.write(`Tags: ${data.tags.map((tag) => tag.name).join(' ')}\n`);
            // os.write('Authors:\n');
            // data.authors.forEach((author) => {
            //     os.write(`* ${author.name}\n`);
            // });
            // os.write(`Total Installs: ${data.installs}\n`);
            // os.write(`Total Plays: ${data.plays}\n`);
            // os.write(`Total Plays (14 days): ${data.plays_14d}\n`);
            // os.write(
            //     `Released: ${new Date(data.released * 1000).toLocaleString()}\n`
            // );
            // os.write('\n');
            // os.write(`Available Versions\n`);
            // os.write(`-------------------------\n`);
            // data.versions.forEach((version) => {
            //     os.write(`* ${version.name} (ID: ${version.id})\n`);
            // });
        }
    }
};
