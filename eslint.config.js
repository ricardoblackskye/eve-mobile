const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  {
    ignores: ["node_modules/**", "dist/**", "coverage/**"],
  },
  // Allow Node globals (e.g. __dirname) in this config file and other JS scripts.
  {
    files: ["*.js", "*.cjs"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        console: "readonly",
      },
    },
  },
  ...compat.extends("expo"),
  {
    // Test files run under Jest (Babel, no type-check): expose jest globals so
    // `no-undef` does not fire on describe/it/expect/jest.
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
    },
  },
];
