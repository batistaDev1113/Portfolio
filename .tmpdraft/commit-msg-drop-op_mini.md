chore(deps): drop "not op_mini all" clause from browserslist config

Removes the `"not op_mini all"` query from `package.json#browserslist`, reducing the field from 4 clauses to the user's literal 3-clause recommendation.

Config (now): `["last 2 versions", "not dead", "not IE 11"]`
Config (was, via PR #76): `["last 2 versions", "not dead", "not IE 11", "not op_mini all"]`

Why:
- Aligns the live `origin/main` state with the user's literal
  recommendations per the staged body in PR #75 (the future
  migration body documents exactly this 3-clause variant).
- Path A reconciliation per the staged body's
  `### Browserslist policy` section.
- Drops 1 line of `op_mini all` data from `caniuse-lite`'s resolved
  target list (saves a small amount of vendor-prefix data; no
  meaningful JS-syntax impact because `not dead` already excludes
  Opera Mini's Presto/Proxy engine from receiving modern JS syntax
  coverage).

Why we accept the trade:
- The 4-clause variant had a low-cost bundle-size benefit (Opera
  Mini's proxy JS engine skips `class` / arrow functions / modern
  syntax, forcing unnecessary polyfills).
- The 3-clause variant INCLUDES Opera Mini in the resolved browserslist
  target list, but `not dead` already excludes Presto / older Opera
  variants. So the practical impact is: future maintainers reading
  the config can know exactly which 3 clauses govern browser support.
- The user's literal preference is for the 3-clause variant. This PR
  honors that preference on the live main branch so the future
  migration PR (`chore/tailwind-3-to-4-migration`) will inherit it
  automatically when it opens against this branch state.

Verification:
- node JSON.parse: valid JSON
- npx browserslist 3-clause: resolves to 23 targets (1 more than
  4-clause's 22; only diff is `op_mini all` re-inclusion)
- npx tsc --noEmit: 0 errors
- npx jest --watchAll=false: 10/10 tests green across 3 test suites
- npm run build: succeeded in 37.8s, all 7 static pages generated,
  production optimized build emitted cleanly

Linkage:
- Predecessor: PR #76 (`chore/browserslist-modern-default`) added the
  4-clause variant. We are now narrowing it to 3 clauses.
- Discovery + staged body: PR #75 + 4 superseding author comments
  (ids 5124414604, 5124428255, 5124440434, 5124479392).
- Autoprefixer-drop policy: PR #67 comment 5124332375.
- Audit gate: PR #57 (audit gate at `--audit-level=critical`,
  `--omit=dev`).

Co-decided with PR #76 + the user's literal recommendation captured
in PR #75's staged migration body.
