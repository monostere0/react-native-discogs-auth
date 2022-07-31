module.exports = {
  root: true,
  rules: {
    quotes: [2, 'single'],
  },
  env: {
    node: true,
    browser: true,
  },
  globals: {
    test: true,
  },
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
};
