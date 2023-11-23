import {CommandModule} from 'yargs';
import {command as info} from './info';
import {command as search} from './search';
import {GlobalCLIOptions} from '../../types';

export const command: CommandModule<GlobalCLIOptions> = {
    command: 'modpack',
    describe: 'Operations relating to modpacks.',
    builder(yargs) {
        return yargs.command([info, search] as CommandModule[]);
    },
    handler() {
        //-- Do nothing
    }
};
