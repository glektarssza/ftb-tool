module.exports = {
    root: true,
    ignorePatterns: ['node_modules/**', '**/*.js'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json']
    },
    plugins: [
        '@typescript-eslint',
        'tsdoc',
        'prettier'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended'
    ],
    rules: {
        'tsdoc/syntax': 'warn',
        'prettier/prettier': 'error'
    }
};
