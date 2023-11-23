import {CommandModule} from 'yargs';
import {command as info} from './info';
import {GlobalCLIOptions} from '../../types';

/**
 * The command-line options for the `version` command.
 */
export interface VersionCLIOptions extends GlobalCLIOptions {}

/**
 * The `modpack` command.
 */
export const command: CommandModule<GlobalCLIOptions, VersionCLIOptions> = {
    command: 'version',
    describe: 'Operations relating to modpack versions.',
    builder(yargs) {
        return yargs.command(info);
    },
    handler() {
        //-- Do nothing
    }
};
