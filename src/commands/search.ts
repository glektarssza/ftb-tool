import {Writable} from 'node:stream';
import {CommandModule} from 'yargs';
import {GlobalCLIOptions} from '../types';
import {setVerbose, Logger} from '../lib/logging';
import {createWritableStream} from '../lib/fs';
import {getFTB} from '../lib';
import {escape} from 'node:querystring';

const logger = new Logger('search');

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

interface SearchResponseData {
    packs: number[];
    curseforge: number[];
    limit: number;
    results: number;
}

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
                default: false,
                implies: 'json'
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
        logger.info(`Searching for modpacks by term "${args.term}"`);
        const data = await getFTB(
            `/modpacks/search/${args.limit}?term=${escape(args.term)}`
        );
        const os = new Writable();
        if (args.output === '-') {
            os.pipe(process.stdout);
        } else {
            const ofs = await createWritableStream(args.output);
            os.pipe(ofs);
        }
        if (args.json) {
            let outputData: string;
            if (args.pretty) {
                outputData = JSON.stringify(data, undefined, 4);
            } else {
                outputData = JSON.stringify(data);
            }
            os.write(outputData);
        } else {
            os.write(`Pack ID - Pack Name\n`);
            os.write(`-------------------\n`);
        }
        os.write('\n');
    }
};
