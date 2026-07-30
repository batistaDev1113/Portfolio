## chore(format): auto-fix prettier CRLF + style issues

This PR runs `npm run format` to normalize line endings and other prettier-style issues across the working tree. **345 `prettier/prettier` errors reduced to zero.** No logical / behavioral changes — pure byte-level layout normalization (CRLF→LF on most files, JSON array collapsing on `tsconfig.json`).

### Why

This is a **prerequisite** for the upcoming `chore/tailwind-3-to-4-migration` PR. The migration PR has an explicit `npx eslint .` verification step in its body:

> `npx eslint .` — must report 0 errors. The migration is expected to resolve the 3 outstanding v3-era lint findings …

Without this cleanup, the 345 CRLF errors would surface as "real lint failures" rather than as confirmable-no-op formatting noise — pulling the migration PR's verification step in the wrong direction. Cleaning the lint gate now means the migration PR focuses purely on the CSS/PostCSS/package.json diffs.

### Files touched (7)

| File | Change | Behavior |
|---|---|---|
| `app/not-found.tsx` | CRLF → LF + whitespace cleanup | None |
| `app/styles/globals.css` | CRLF → LF + prettier-format | None |
| `components/ModeToggle.tsx` | CRLF → LF | None |
| `components/Navigation.tsx` | CRLF → LF | None |
| `eslint.config.js` | CRLF → LF + prettier-format | None |
| `next.config.js` | CRLF → LF + prettier-format | None |
| `tsconfig.json` | Short JSON arrays collapsed to single lines per prettier-JSON rule | None |

TypeScript compiler, JSON parser, PostCSS, Bun/npm/jest all consume these files equivalently across both CRLF and LF endings; the JSON array formatting in `tsconfig.json` is whitespace-tolerant in JSON parsers. The lint `tsc` `jest` `build` gates pass post-format.

### Net diff to `origin/main`

Per `git diff --stat`, only `tsconfig.json` shows structural diff (collapsing two short multi-element JSON arrays to single-line arrays). The other 6 files have CRLF→LF only, which GitHub may render as empty diff depending on the machine-local CRLF/LF handling. **Total visible diff:** `1 file changed, 2 insertions(+), 8 deletions(-)` per `git diff --stat`.

### Verification (all gates green post-format)

```
===PRE-FORMAT===
$ npx eslint .
345 problems (345 errors, 0 warnings) -- all prettier/prettier CRLF

===POST-FORMAT===
$ npx eslint .
0 errors

===TSC===
$ npx tsc --noEmit
0 errors

===JEST===
$ npx jest --watchAll=false --silent
10/10 tests green across 3 test suites

===BUILD===
$ npm run build
✓ Compiled successfully
✓ Generating static pages (7/7) in ~3.5s
All routes (/, /_not-found, /api/contact, /robots.txt, /sitemap.xml) generated.
```

### Audit gate (`--audit-level=critical --omit=dev`)

Unaffected. Line-ending changes don't introduce new vulnerabilities and don't change production dependencies.

### Code-review verdict

`code-reviewer-minimax-m3` reported **no real risks** — pure mechanical whitespace normalization. Prettier cannot change file semantics. Lockfile unaffected.

### Linked work

- **PR #75** (discovery + staged body) — defines the migration step that depends on this cleanup
- **PR #76 + PR #77** (browserslist 3-clause) — landed prior to this PR so `lint:check` post-format sees the resolved 3-clause config
- **PR #57** (audit gate at `--audit-level=critical`) — unaffected
- **Downstream**: `chore/tailwind-3-to-4-migration` PR (not yet opened) — will open against this branch state

### Recon provenance

- Cleanup date: 2026-07-29
- Audit date: 2026-07-29 (verified 345 → 0 transition)
- Maintainer sign-off: yes (single-maintainer portfolio) — the user IS the maintainer

### Why this lands BEFORE the migration PR

Per the user's explicit directive: "If 345 prettier CRLF errors block the lint step, open a separate `chore/format-lint-cleanup` PR first to run `npm run format`." Without this PR, the migration PR's `npx eslint .` step would surface the 345 errors as real findings, overshadowing the actual migration work.
