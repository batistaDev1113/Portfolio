# ADR 0010: Catalog the basher/AGENTS.md tool-quirks journey (PRs #102-#105)

- **Status:** Accepted
- **Date:** 2026-07-30
- **Implementation PRs:**
  - [#102](https://github.com/batistaDev1113/Portfolio/pull/102) `chore(docs): catalog basher shape failure in AGENTS.md`
  - [#103](https://github.com/batistaDev1113/Portfolio/pull/103) `chore(docs): add Tool quirks cross-ref to PR template`
  - [#104](https://github.com/batistaDev1113/Portfolio/pull/104) `chore(ci): follow redirects in prod-smoke curl battery` (production-ship of the body-file working example)
  - [#105](https://github.com/batistaDev1113/Portfolio/pull/105) `chore(docs): catalogue gh pr body-file Windows path-resolution failure` (4th Operational discipline bullet)

## Context

A multi-turn agentic-run failure pattern: basher commands of ~12 KB
with nested single quotes inside JSON-escaped content get mangled by
the JSON serialization + bash tokenization interaction, surfacing as
`bash: -c: line N: unexpected EOF while looking for matching '`.
Cost: 2 retry turns per episode. The pattern surfaced twice this
session: (a) basher-shape failure (during PR #103, #104 ships), and
(b) `gh pr create --body-file` Windows path-resolution gap
(`write_file` resolves `/tmp/` to literal `C:\tmp\`; bash + gh CLI
+ git resolve it to MSYS user-temp `C:/Users/.../AppData/Local/Temp/`).
Captured across PR #102 #103 #104 #105 ship sequences (failures lived
in agentic basher invocations, not in CI run artifacts).

## Decision

Adopt `AGENTS.md → ## Tool quirks: basher shape failure` as the
canonical agent-facing runbook section. Operational discipline section
holds four bullets: (1) 6 KB command cap; (2) `printf '%s\n'` for
body-file writes; (3) explicit `$?` capture pattern when piping
`gh … | tail -N`; (4) `gh pr create --body-file` Windows
path-resolution workaround via heredoc to `/tmp/gh-body/`. Three
working examples for reusable scenarios:

- `printf '%s\n' '...' > tmp_*.md + gh pr … --body-file` (used
  PR #98 #100 #101)
- `cat > /tmp/gh-body/pr_body.md << 'EOF' … EOF + gh pr create
  --body-file /tmp/gh-body/pr_body.md` (used PR #104 #107)
- `set +e; …; rc=$?; echo "rc=$rc"` to capture the actual exit
  code when piping `gh … | tail -N`

The `PULL_REQUEST_TEMPLATE.md` Reviewer checklist cross-reference
self-polices any future AGENTS.md-touching PR (PR #103 conditional
bullet).

## Cross-references

- Precedent patterns: [#57](https://github.com/batistaDev1113/Portfolio/pull/57) `npm audit --omit=dev --audit-level=critical` audit gate, [#85](https://github.com/batistaDev1113/Portfolio/pull/85) prod-smoke nightly cron + apex→www 308 fix.

— Authored post-merge of PR #105 on 2026-07-30; format mirrors
  `0009-drop-babel-toolchain.md`.
