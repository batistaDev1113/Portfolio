chore(format): auto-fix prettier CRLF + style issues across 7 files

Runs `npm run format` (which executes `prettier --write` across the project's source globs) to normalize line endings and other prettier-style issues. The previous 345 `prettier/prettier` errors (predominantly CRLF line-ending violations) are reduced to zero.

Files touched (7):
- `app/not-found.tsx` (CRLF normalization + whitespace cleanup)
- `app/styles/globals.css` (CRLF normalization + prettier-format)
- `components/ModeToggle.tsx` (CRLF normalization)
- `components/Navigation.tsx` (CRLF normalization)
- `eslint.config.js` (CRLF normalization + prettier-format)
- `next.config.js` (CRLF normalization + prettier-format)
- `tsconfig.json` (collapsed short JSON arrays to single lines per prettier JSON formatting rule)

No logical / behavioral changes. Pure byte-level layout normalization.

Why: prerequisite for the upcoming `chore/tailwind-3-to-4-migration` PR. The migration PR has a `npx eslint . --report-zero-errors` verification step; without the cleanup, the 345 CRLF errors would surface as "real lint failures" rather than as confirmable-no-op formatting noise. Cleaning the lint gate ahead of time means the migration PR focuses purely on the CSS/PostCSS/package.json diffs.

Verification:
- pre-format: `npx eslint .` reports 345 problems (all prettier/prettier CRLF)
- post-format: `npx eslint .` reports 0 problems
- `npx tsc --noEmit`: 0 errors (unchanged from pre-format)
- `npx jest --watchAll=false --silent`: 10/10 tests green (unchanged from pre-format)
- `npm run build`: succeeds in normal time, all 7 static pages generated

Audit gate (`--audit-level=critical --omit=dev`) is unaffected: line-ending changes don't introduce new vulnerabilities and don't change production dependencies.

Linkage:
- Upstream prerequisite: PR #75 (discovery + staged body)
- Upstream prerequisite: PR #76 + PR #77 (browserslist 3-clause resolution)
- Downstream enabler: upcoming `chore/tailwind-3-to-4-migration` PR
- Documentation of the lint-blocking issue: PR #75 staged body plus the comment thread on PR #75 confirming 345 errors existed.
