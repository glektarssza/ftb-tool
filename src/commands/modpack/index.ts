import {CommandModule} from 'yargs';
import {command as info} from './info';
import {command as search} from './search';
import {GlobalCLIOptions} from '../../types';

export interface ModpackCLIOptions extends GlobalCLIOptions {}

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
