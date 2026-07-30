const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: 'jest-environment-jsdom',

  // Exclude Playwright integration tests from jest's default testMatch.
  // Jest's default '**/__tests__/**/*.{js,ts}' glob would otherwise pick
  // up the .spec.js files in __tests__/e2e/ and fail to load them -- those
  // are owned by the `playwright test` runner, not jest.  Local + CI both
  // confirmed this exclusion is needed: jest before the exclusion tried
  // to import @playwright/test as a JS module and the test suite crashed
  // with "SyntaxError: Cannot use import statement outside a module".
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/e2e/'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
