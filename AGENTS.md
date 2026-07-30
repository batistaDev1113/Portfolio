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
