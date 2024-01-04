const os = require('node:os');
const path = require('node:path');

const cpuCoreCount = os.cpus().length;
const jobs = Math.floor(cpuCoreCount / 2);

process.env['TS_NODE_PROJECT'] = path.resolve(__dirname, './tests/tsconfig.json');

console.log(`Using ${jobs} parallel workers...`);

module.exports = {
    ui: 'bdd',
    'check-leaks': true,
    'fail-zero': false,
    parallel: true,
    jobs,
    timeout: 5000,
    reporter: 'spec',
    extension: ['ts'],
    recursive: true,
    spec: './tests/**/*.spec.ts',
    require: ['tsconfig-paths/register', 'ts-node/register']
};
