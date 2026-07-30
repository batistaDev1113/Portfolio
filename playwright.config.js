// playwright.config.js
// Configuration for the Hero bio+title visual regression suite (the regression
// net for the Hero bio+title content shipped in PR #118 — the manual browser-use
// verifications are now automated here, so a future bio+title revert is caught
// by CI without needing human-in-the-loop verification).
//
// See __tests__/e2e/hero.spec.js for the actual assertions.
//
// Tradeoffs (per Thinker-with-files verdict on the non-trivial Playwright
// integration architecture fork):
//   - chromium-only project: smallest CI install footprint (~400MB saved vs
//     3-way matrix), fastest cold-cache restore via actions/cache@v4
//     (.github/workflows/e2e-hero.yml).
//   - webServer = `npm run start` on http://localhost:3000 (port 3000 is
//     next start's default; baseURL avoids bundling it into every locator).
//     CI workflow explicitly sequences `npm ci` -> `playwright install`
//     -> `npm run build` -> `npm run test:e2e` so a build failure aborts
//     before the playwright step runs (clear audit-trail separation).
//   - retries: process.env.CI ? 2 : 0 — tolerates one transient Next.js
//     hydration race or Vercel CDN 308 redirect flicker in CI without
//     spuriously failing the build.
//   - workers=1 in CI: avatars + 4 staggered Framer Motion transitions
//     (delays 0.5s/1s/1.5s/2s in components/Hero.tsx) need stable per-page
//     timing; parallel workers can race the timing-sensitive assertions.
//   - timeout 30s + expect 5s: enough for the 2s Framer stagger delay +
//     SSR'd page (~39 KB content) + any CSP prerender overhead.
//   - headless: true, trace: 'on-first-retry': collects full Playwright
//     traces (DOM, network, screenshot timeline) on the rare failure for
//     downstream debugging, costs ~5MB on the rare failing run.
//
// Pins: kept CommonJS to match next.config.js / jest.config.js / postcss.config.js
// in this repo. Project's package.json does NOT declare `"type": "module"`.

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Honor user's explicit path requirement ("adds an automated Playwright
  // integration test to __tests__/").
  testDir: './__tests__/e2e',
  // Match `.spec.js` suffix only so jest's `*.test.js` files are NOT
  // picked up by the Playwright runner (jest already owns those).
  testMatch: '**/*.spec.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 30 * 1000,
  expect: { timeout: 5 * 1000 },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // webServer assumes the caller (workflow step or local shell) has already
  // run `npm run build`.  CI workflow: "Build production app" step runs
  // immediately before "Run Playwright tests" so the artifact is fresh.
  // Local: `npm run build && npm run test:e2e` in sequence.
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
