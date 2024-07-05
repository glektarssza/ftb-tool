// @deno-types="npm:@types/yargs"
import yargs from 'npm:yargs';

yargs()
    .strict(true)
    .showHelpOnFail(true)
    .demandCommand(1)
    .recommendCommands()
    .scriptName('ftb-tool')
    .epilog("Copyright (c) 2024 G'lek Tarssza, licensed under the MIT License.")
    .help(
        'help',
        'Display the help information.',
        true,
    ).alias('h', 'help').version(
        'version',
        'Display the version information.',
        '0.0.0',
    ).alias('v', 'version')
    .option('verbose', {
        type: 'boolean',
        default: false,
        description: 'Whether to output verbose logging messages.',
        group: 'Logging',
        global: true,
    })
    .parse(Deno.args);
