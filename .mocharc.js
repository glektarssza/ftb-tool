const path = require('node:path');

process.env['TSX_TSCONFIG_PATH'] = path.resolve(__dirname, './tests/tsconfig.json');

module.exports = {
    ui: 'bdd',
    'check-leaks': true,
    'fail-zero': false,
    timeout: 5000,
    reporter: 'spec',
    extension: ['ts'],
    recursive: true,
    spec: './tests/**/*.spec.ts',
    'node-option': ['import=tsx']
};
