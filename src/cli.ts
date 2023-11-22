import chalk from 'chalk';
import yargs, {CommandModule} from 'yargs';
import {hideBin} from 'yargs/helpers';
import {APP_NAME, APP_VERSION} from './constants';
import commands from './commands';
import {Logger} from './helpers/logging';

const logger = new Logger('app');

yargs(hideBin(process.argv))
    .scriptName(APP_NAME)
    .help('help', 'Display the help information.')
    .version('version', 'Display the version information.', APP_VERSION)
    .epilog("Copyright (c) 2023 G'lek Tarssza, licensed under the MIT License.")
    .strict()
    .option('verbose', {
        type: 'boolean',
        alias: 'v',
        default: false,
        description: 'Whether to display verbose logging.'
    })
    .option('maxConnections', {
        type: 'number',
        alias: 'mc',
        default: 3,
        description: 'The maximum number of parallel connections to use.'
    })
    .option('timeout', {
        type: 'number',
        alias: 't',
        default: 10,
        description: 'The timeout for network requests, in seconds.',
        coerce(value: number) {
            return value * 1000;
        }
    })
    .option('curseForgeAPIKey', {
        type: 'string',
        description: 'The API key to use when connecting to the CurseForge API.'
    })
    .option('userAgent', {
        type: 'string',
        description: 'A custom user agent to use when making network requests.'
    })
    .recommendCommands()
    .demandCommand()
    .command(commands as CommandModule[])
    .parseAsync()
    .then(() => {
        logger.info(chalk.greenBright('Success'));
        process.exitCode = 0;
    })
    .catch((err: Error) => {
        logger.error(chalk.red('Fatal error:'));
        logger.error(err.message);
        process.exitCode = 1;
    });
