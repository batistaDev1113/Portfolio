const nextCfg = require('eslint-config-next/core-web-vitals');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginPrettier = require('eslint-plugin-prettier');

const nextCfgEntries = Array.isArray(nextCfg) ? nextCfg : [nextCfg];

// eslint-config-next registers the `jsx-a11y` plugin in one of its own config
// objects. ESLint 10 resolves a rule's plugin from the same config object, so
// the plugin must be re-registered alongside the rules below -- and it has to
// be the *same object reference*, otherwise ESLint rejects the redefinition
// with 'Cannot redefine plugin "jsx-a11y"'.
const jsxA11yPlugin =
  nextCfgEntries.map((entry) => entry.plugins?.['jsx-a11y']).find(Boolean) ??
  jsxA11y;

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
  // Apply the full `jsx-a11y` recommended rule set on top of the subset that
  // eslint-config-next enables by default.
  {
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
    },
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
