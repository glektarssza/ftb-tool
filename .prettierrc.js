module.exports = {
    arrowParens: "always",
    bracketSameLine: true,
    bracketSpacing: false,
    endOfLine: "lf",
    htmlWhitespaceSensitivity: "css",
    jsxSingleQuote: true,
    overrides: [
        {
            files: [
                "*.{yml,yaml}"
            ],
            options: {
                tabWidth: 2
            }
        }
    ],
    printWidth: 80,
    proseWrap: "preserve",
    quoteProps: "as-needed",
    semi: true,
    singleQuote: true,
    trailingComma: "none",
    useTabs: false,
    tabWidth: 4,
    vueIndentScriptAndStyle: true
};
