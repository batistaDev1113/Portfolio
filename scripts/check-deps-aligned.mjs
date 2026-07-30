#!/usr/bin/env node
/**
 * scripts/check-deps-aligned.mjs
 *
 * Pre-build guard: assert that `node_modules` is in sync with the lock-
 * pinned resolved versions for peer-sensitive packages (TypeScript,
 * @testing-library/dom, ESLint). Catches stale installs that would
 * otherwise cause Next.js / jest / eslint to abort MID-operation
 * with cryptic errors. With this hook, the failure becomes a 2-second
 * pre-build error with a clear actionable message.
 *
 * Run manually:  node scripts/check-deps-aligned.mjs
 * Auto-run via:  npm run build   (the `prebuild` script fires first)
 *
 * No third-party deps — uses only node:fs + node:process. Works on
 * macOS/Linux/Windows. ESM (.mjs) so `import` syntax is unambiguous
 * and works with the repo's `engines.node: ">=22.0.0 <23.0.0"`.
 */

import { readFileSync, existsSync } from 'node:fs';
import process from 'node:process';

const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const locked = lock.packages ?? {};

/**
 * Peer-sensitive packages whose lockfile/install version MISS caused a
 * concrete recent CI failure. Extend this list when adding a new
 * install-sensitive dep — the list is the only hand-curated input.
 */
const checked = ['typescript', '@testing-library/dom', 'eslint'];

let bad = 0;
for (const pkg of checked) {
  const resolved = locked[`node_modules/${pkg}`]?.version;
  const installPath = `node_modules/${pkg}/package.json`;

  if (!existsSync(installPath)) {
    console.error(`  ✗ ${pkg}: NOT INSTALLED (lockfile resolves to ${resolved ?? 'unknown'})`);
    bad++;
    continue;
  }

  const installed = JSON.parse(readFileSync(installPath, 'utf8')).version;

  if (resolved && installed !== resolved) {
    console.error(`  ✗ ${pkg}: lockfile=${resolved}, installed=${installed}`);
    bad++;
  } else {
    console.log(`  ✓ ${pkg}: ${installed} (matches lockfile)`);
  }
}

if (bad > 0) {
  console.error('');
  console.error(`❌ ${bad} dep(s) out of sync with package-lock.json.`);
  console.error('   Run `npm ci --legacy-peer-deps` to re-align and retry.');
  console.error(
    '   (This means a previous `npm install` (without `--ci`) drifted ' +
      'from the lockfile, or a stale `node_modules` survived a checkout.)',
  );
  process.exit(1);
}

console.log('✓ node_modules aligned to package-lock.json');
