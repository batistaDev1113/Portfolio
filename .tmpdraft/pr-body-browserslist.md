## chore(deps): add browserslist modern-default config

This PR adds a centralized `package.json#browserslist` field with the project's modern-default browser targets. **8 lines added, 0 lines removed, 1 file changed.**

Config: `["last 2 versions", "not dead", "not IE 11", "not op_mini all"]`

### Why

This is a **prerequisite** for the future `chore/tailwind-3-to-4-migration` PR (which will drop `autoprefixer` per the PR #67 audit-policy decision). Without an explicit `browserslist` field, three subsystems silently fall back to older defaults:

1. **Tailwind v4 Lightning CSS** — relies on `browserslist` for vendor-prefix fallback decisions. (Will be added in the migration PR; pre-emptively configured here.)
2. **Jest / `@babel/preset-env`** — `babel-jest@^30.4.1` + `@babel/preset-env@^7.23.3` are in `devDependencies` and read `browserslist` for JS-syntax downleveling.
3. **Next.js 16 SWC compiler (Turbopack)** — reads `browserslist` directly for JS-downlevel targets. There is no explicit `swcTargets` in `next.config.js`, so SWC relies entirely on this field.

### Why each clause is here

| Clause | Effect |
|---|---|
| `last 2 versions` | Include the current release and the previous one of each browser family. Modern default. |
| `not dead` | Exclude browsers with <0.5% market share that are unsupported by their vendor (IE 11, old Opera Presto, UC Browser for Android). |
| `not IE 11` | Explicit IE 11 exclusion. Already covered by `not dead` on browserslist 4.x. Kept for clarity-of-intent (a future maintainer reading the config alone should not need to know what `not dead` excludes). |
| `not op_mini all` | Exclude Opera Mini, whose proxy JS engine skips `class`, arrow functions, and modern syntax. Drops the bundle's polyfill burden. <0.5% market share. |

### Placement

`package.json#browserslist` field (not `.browserslistrc`). Matches the convention used by other tooling that supports inline config (`package.json#prettier`, `package.json#eslintConfig`, `package.json#commitlint`). One less dotfile for the next maintainer to find.

### Co-decided with autoprefixer drop

The user's directive binds this config change to the autoprefixer-drop decision (PR #67, comment id `5124332375`): "browserslist configuration ... [autoprefixer and Next.js's build] consume it ... so it can NOT be dropped." This PR documents the explicit config in advances of the larger migration PR.

The future `chore/tailwind-3-to-4-migration` PR will inherit this config automatically once this PR merges.

### Verification

```
===JSON-VALIDITY===
package.json: valid JSON, browserslist field present

===PARSE-BROWSERSLIST-CONFIG===
$ npx browserslist "last 2 versions, not dead, not IE 11, not op_mini all"
22 target environments resolved (Chrome 132+, Firefox 134+, Safari 17+, etc.)

===TSC===
$ npx tsc --noEmit
no output (0 errors)

===JEST===
$ npx jest --watchAll=false --silent
10/10 tests green across 3 test suites

===BUILD===
$ npm run build
✓ Compiled successfully in 10.8s
✓ runAfterProductionCompile in 937ms
✓ Generating static pages (7/7) in ~1.7s
All routes (/, /_not-found, /api/contact, /robots.txt, /sitemap.xml) generated.
```

### Code-review verdict

`code-reviewer-minimax-m3` reported **no real risks**: schema-correct, minimal change, style-compliant (2-space indent, double-quoted strings, no trailing commas). Only micro-observation: `not IE 11` is redundant with `not dead` on browserslist 4.x — KEPT per user's literal recommendation.

### Linked work

- **PR #75** (`chore/tailwind-v4-discovery`) — discovery audit, defines the broader migration context.
- **PR #67** — autoprefixer-drop policy (comment id `5124332375`); this PR is the prerequisite implementation of the `browserslist` retention decision documented there.
- **PR #57** — audit gate at `--audit-level=critical`; unaffected.
- **PR #66** — `@types/node` 22→26 bump; unaffected.

### Recon provenance

- Co-decision date: 2026-07-29 (same session as the vendor-prefix retention and autoprefixer-drop decisions).
- Maintainer sign-off: yes (single-maintainer portfolio) — the user IS the maintainer.

### When to merge

This PR is ready to merge as-is. All local verification gates passed (tsc, jest, build). The GitHub-side CI gate (PR #57 audit job) will also pass because this change does not modify any production dependencies; only adds a build-time config field.

The merge MUST land before the future `chore/tailwind-3-to-4-migration` PR opens, because the migration PR's behavior depends on this config being present (Lightning CSS reads it during the build pipeline).
