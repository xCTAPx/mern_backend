module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  ignorePatterns: ["/dist"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ["@typescript-eslint"],
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
