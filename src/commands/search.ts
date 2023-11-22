import {escape} from 'node:querystring';
import {Writable} from 'node:stream';
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

/**
 * The logger for this module.
 */
const logger = new Logger('command:search');

/**
 * The command-line options for the `search` command.
 */
export interface SearchCLIOptions extends GlobalCLIOptions {
    /**
     * The term to search for.
     */
    term: string;

    /**
     * The maximum number of results to return.
     *
     * Defaults to `10`.
     */
    limit: number;

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
 * The shape of the data that comes back from the `search` Feed the Beast
 * endpoint.
 */
interface SearchResponseData {
    /**
     * The IDs of the Feed the Beast packs that matched the search.
     */
    packs: number[];

    /**
     * The IDs of the CurseForge packs that matched the search.
     */
    curseforge: number[];

    /**
     * The total number of results returned across all modpack sources.
     */
    total: number;

    /**
     * The maximum number of results returned per modpack source.
     */
    limit: number;

    /**
     * The timestamp at which this data was last refreshed.
     */
    refreshed: number;
}

/**
 * The `search` command.
 */
export const command: CommandModule<GlobalCLIOptions, SearchCLIOptions> = {
    command: 'search <term>',
    describe: 'Search the Feed the Beast API for the given term.',
    builder(yargs) {
        return yargs
            .positional('term', {
                type: 'string',
                description: 'The term to search for.',
                demandOption: true
            })
            .option('limit', {
                type: 'number',
                description: 'The maximum number of results to return.',
                default: 10
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
        logger.info(`Searching for modpacks by term "${args.term}"`);
        const {packs} = await getFTB<SearchResponseData>(
            `/modpack/search/${args.limit}?term=${escape(args.term)}`
        );
        const data = await Promise.all(
            packs.map(async (id) => {
                return await getFTB<ModpackManifest>(`/modpack/${id}`);
            })
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
            os.write('Pack ID - Pack Name\n');
            os.write('-------------------\n');
            data.forEach(({id, name}) => {
                os.write(`${id} - ${name}\n`);
            });
        }
    }
};
