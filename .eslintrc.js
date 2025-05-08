// https://docs.expo.dev/guides/using-eslint/

module.exports = {
    extends: ['expo', 'prettier'],
    plugins: ['prettier'],
    ignorePatterns: ['/dist/*'],
    rules: {
        // Enforce 4-space indentation using the standard rule
        indent: ['info', 4],
        'prettier/prettier': 'warn',
    },
};
