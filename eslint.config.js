const nextCfg = require('eslint-config-next/core-web-vitals');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: [
      '.next/',
      'node_modules/',
      'out/',
      'coverage/',
      '.vercel/',
      '__tests__/coverage/',
      '__tests__/e2e/',
      '.jest/',
    ],
  },
  ...nextCfg,
  // eslint-config-next already registers the `jsx-a11y` plugin, so we apply
  // only the rules from the recommended preset to avoid redefining the plugin.
  {
    rules: jsxA11y.configs.recommended.rules,
  },
  eslintConfigPrettier,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-multiple-empty-lines': [2, { max: 99999, maxEOF: 0 }],
    },
  },
];
