module.exports = {
    ui: 'bdd',
    checkLeaks: true,
    failZero: false,
    reporter: 'spec',
    extension: ['ts'],
    recursive: true,
    spec: './tests/**/*.spec.ts',
    nodeOption: ['import', 'tsx']
};
