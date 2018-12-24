module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module'
    },
    extends: 'eslint:recommended',
    env: {
        es6: true,
        node: false,
        browser: true
    },
    rules: {
        semi: [
            "error",
            "always"
        ],
        "no-console": 0
    }
};
