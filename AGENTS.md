# Agent runbook

Operational notes for agentic / automated runs against this repo. Read this
**before** invoking `gh pr merge` or evaluating a CI gate.

## gh CLI: do not use `--yes` on `gh pr merge`

Earlier gh versions (including `gh 2.96.0`, verified via `gh pr merge --help`)
do not recognize `--yes` on `gh pr merge`. Calling it raises
`unknown flag: --yes` and exits non-zero — and prior agentic runs that piped
the output through `tail` masked the failure because `$?` was capturing `tail`'s
always-0 exit code, not `gh`'s. Result: claimed merges never landed on
`origin/main`. Re-verify with `gh pr merge --help` against your installed binary
if you suspect a newer gh version added the flag.

### Pattern to avoid

```bash
# WRONG (silent-fail in gh 2.x): the `--yes` flag is unknown.
gh pr merge $N --admin --squash --delete-branch --yes
```

### Canonical merge pattern

```bash
gh pr merge $N \
  --admin \
  --squash \
  --delete-branch \
  --subject '<conventional-commit subject>' \
  --body-file ./tmp_merge_body.md
```

Notes:

- `--body-file` dodges the shell-escape landmines that come with inline `--body '…'`.
- `--admin` is the project's branch-protection bypass (`enforce_admins=false` on `main`).
- To verify a merge **really** landed: `git fetch origin main && git log -1 origin/main`
  and the GitHub Contents API for the touched file — do **not** trust a `$?` capture
  from a piped `gh … | tail -N` chain.
- Clean up `./tmp_*.json` and `./tmp_*.md` diagnostic artifacts after every successful
  merge; they pile up quickly across turns.

## Audit gate: `npm audit --omit=dev --audit-level=critical`

`.github/workflows/security-audit.yml` (PR #57) enforces this gate at the
`critical` level. Any `critical` advisory blocks auto-merge; high-severity
advisories are accepted as the project's risk envelope — re-poll
`npm audit --omit=dev --json | jq '.metadata.vulnerabilities.high // 0'` before quoting any
specific count in a downstream advisory.

When staging a merge, run `npm audit --omit=dev --audit-level=critical`
locally and surface `failure: 0` explicitly rather than trusting the
GitHub-side rollup, which can briefly flicker `FAIL` while status checks rerun.

## Upstream-unblock watcher pattern

When polling upstream packages for an installed-deps unlock (e.g., a peer-bump
that gates `.npmrc legacy-peer-deps=true` reversibility — see PR #96), follow
the canonical template documented in the body of
[Issue #95](https://github.com/batistaDev1113/Portfolio/issues/95)
("Track upstream unblock: …"). That issue's body now contains a complete
agentic template — do **not** re-derive the structure ad hoc. Required
components (all five expected):

- **TL;DR** — a single Markdown blockquote at the top stating the close-
  trigger (Constraint `(a)` OR Constraint `(b)`).
- **Monitoring schedule** — concrete bash probes against the relevant
  `npm view … peerDependencies` / `… dependencies.<pkg>` endpoints, run
  on a weekly cadence. **Note**: `peerDependencies` lists a package's
  demands-from-its-consumer; for transitive-bump checks, read the
  consumer's *dependencies* first (range), then resolve + query the
  transitive peer's `peerDependencies` (Constraint (b) does this).
- **Reversal-criteria checklist** — bullets naming the two close-trigger
  conditions the weekly poll watches for, plus the `(a)`/`(b)`
  verification commands.
- **Branch-first reversal procedure** — opens a feature branch off
  `main` (per the AGENTS.md canonical safe pattern) as the **first**
  step; the `.npmrc ` / equivalent reversible-flag change + the 5-gate
  verification (lint / tsc / jest / build / audit) + re-install without
  the flag come **after** the branch is open. Sanity-check the staged
  diff before pushing.
- **Evidence-chain capture** — when a close-trigger observation is
  recorded, capture `ISO date` + the verbatim `npm view` stdout that
  triggered the close call + `git rev-parse origin/main` at observation
  time, in a close-comment on the tracking issue. Audit-trail for the
  close decision; protects against retracted npm publishes / transient
  peer-field typos.

Issue #95's body and `.github/workflows/weekly-jsx-a11y-watch.yml`
(PR #99 — fires on cron `'30 0 * * 1'` per Issue #95's Monitoring
schedule, with `workflow_dispatch` available for ad-hoc manual
diagnostic runs) are the working examples of this pattern — clone
their structure for any future upstream-watcher issue rather than
re-deriving.
