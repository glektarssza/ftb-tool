import {CommandModule} from 'yargs';
import {command as info} from './info';
import {command as search} from './search';
import {GlobalCLIOptions} from '../../types';

/**
 * The command-line options for the `modpack` command.
 */
export interface ModpackCLIOptions extends GlobalCLIOptions {}

/**
 * The `modpack` command.
 */
export const command: CommandModule<GlobalCLIOptions, ModpackCLIOptions> = {
    command: 'modpack',
    describe: 'Operations relating to modpacks.',
    builder(yargs) {
        return yargs.command(info).command(search);
    },
    handler() {
        //-- Do nothing
    }
};
