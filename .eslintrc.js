module.exports = {
    root: true,
    parser: 'babel-eslint',
    env: {
        "node": true,
        "commonjs": true
    },
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
    ],
    rules: {
      quotes: ['error', 'double'],
      'no-extra-semi': 'error',
      'no-alert': 'error',
      semi: ['error', 'always'],
    },
  };
  