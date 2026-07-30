#!/usr/bin/env node
/**
 * scripts/check-branch-clean.mjs
 *
 * Hygiene floor: asserts `git branch -a` shows only the expected set of
 * branches — i.e. `* main` (or `  main` when main isn't the current HEAD),
 * plus `remotes/origin/main`. Catches the multi-turn "16-branch stale drift"
 * failure mode that motivated this script.
 *
 * Tolerates a comma-separated `BRANCH_WHITELIST` env var for in-flight
 * feature branches — accepts the local `* <name>` form, the local inactive
 * `  <name>` form, AND the remote `remotes/origin/<name>` form.
 *
 * Hard-tolerates the per-clone `remotes/origin/HEAD -> origin/main` symref
 * regardless of whitelist.
 *
 * Exit codes (binary):
 *   0  — clean: every line in `git branch -a` is in the expected set or whitelist.
 *   1  — drift: at least one line is unexpected; remediation hint printed to stderr.
 *
 * Usage:
 *   node scripts/check-branch-clean.mjs                                # strict
 *   BRANCH_WHITELIST=chore/foo,feat/bar node scripts/check-branch-clean.mjs
 *   npm run hygiene:branches                                           # same as plain invocation
 */

import { execSync } from 'node:child_process';
import process from 'node:process';

const EXPECTED_LOCAL = new Set(['* main', '  main']);
const EXPECTED_REMOTE = new Set(['  remotes/origin/main']);
//
// The `remotes/origin/HEAD -> origin/main` symref is intentionally NOT in the
// expected set: it's a per-clone pointer that `git remote set-head origin -a`
// can add/remove. We tolerate it explicitly in the drift logic below.

const whitelist = (process.env.BRANCH_WHITELIST ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// `git branch -a` is the source of truth for drift. Wrap in try/catch so
// non-git-repo or no-`git`-in-PATH invocation produces a clean exit-1 with
// an actionable message rather than an ugly Node ENOENT stack trace.
let raw;
try {
  raw = execSync('git branch -a', { encoding: 'utf8' });
} catch (e) {
  console.error(
    '❌ could not invoke `git branch -a` — are you running from inside a git repository ' +
      'and is `git` available on PATH?\n   ' +
      (e && e.stderr ? String(e.stderr).trim() : 'no stderr captured'),
  );
  process.exit(1);
}
// Split on either LF or CRLF for Windows + `core.autocrlf=true` clones.
// Without this, `EXPECTED.has(line)` would fail when line ends with `\r`
// because the expected literal strings don't carry `\r`.
const lines = raw.split(/\r?\n/).filter(Boolean);

const drift = [];
for (const line of lines) {
  // Tolerate the per-clone HEAD symref regardless of whitelist (post-trim).
  if (line.trim() === 'remotes/origin/HEAD -> origin/main') continue;
  // Tolerate detached-HEAD form (e.g. `git bisect`, experimental checkouts).
  // `git branch -a` emits `* (HEAD detached at <sha>)` in this state.
  if (line.startsWith('* (HEAD detached')) continue;
  if (EXPECTED_LOCAL.has(line) || EXPECTED_REMOTE.has(line)) continue;
  // Whitelist match: `* <name>` (current local), `  <name>` (inactive local),
  // or `  remotes/origin/<name>` (remote tracking ref).
  let tolerated = false;
  for (const w of whitelist) {
    if (line === `* ${w}` || line === `  ${w}` || line === `  remotes/origin/${w}`) {
      tolerated = true;
      break;
    }
  }
  if (!tolerated) drift.push(line);
}

if (drift.length === 0) {
  console.log(`✓ git branch clean: ${lines.length} entries (drift=0)`);
  process.exit(0);
}

console.error(`❌ Branch drift detected: ${drift.length} unexpected entries`);
for (const d of drift) console.error(`   ${d}`);
console.error(
  '   remediation: `gh pr merge <N> --admin --squash --delete-branch` (cleans up after merge) ' +
    'or run `git fetch origin --prune` (clears orphan local tracking refs) or ' +
    'set BRANCH_WHITELIST=<comma-list> to tolerate in-flight work.',
);
process.exit(1);
