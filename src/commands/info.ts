import {CommandModule} from 'yargs';
import {GlobalCLIOptions, ModpackManifest} from '../types';
import {setVerbose, Logger} from '../helpers/logging';
import {createWritableStream} from '../helpers/fs';
import {
    getFTB,
    setRequestTimeout,
    setFlameAPIKey,
    setRequestLimit,
    setUserAgent
} from '../helpers/net';
import {Writable} from 'stream';

/**
 * The logger for this module.
 */
const logger = new Logger('command:info');

/**
 * The command-line options for the `info` command.
 */
export interface InfoCLIOptions extends GlobalCLIOptions {
    /**
     * The ID of the modpack to get information for.
     */
    id: number;

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
 * The `info` command.
 */
export const command: CommandModule<GlobalCLIOptions, InfoCLIOptions> = {
    command: 'info <id>',
    describe: 'Get the information for a Feed the Beast modpack.',
    builder(yargs) {
        return yargs
            .positional('id', {
                type: 'number',
                description: 'The ID of the modpack to get information for.',
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
        logger.info(`Getting information for modpack with ID "${args.id}"`);
        const data = await getFTB<ModpackManifest>(`/modpack/${args.id}`);
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
            os.write(`${data.id} - ${data.name}\n`);
            os.write(`${data.description}\n`);
        }
    }
};
