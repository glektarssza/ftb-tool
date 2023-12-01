const os = require('node:os');
const path = require('node:path');

const cpuCoreCount = os.cpus().length;
const jobs = Math.floor(cpuCoreCount / 2);

process.env['TSX_TSCONFIG_PATH'] = path.resolve(__dirname, './tests/tsconfig.json');

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
    'node-option': ['import=tsx']
};
