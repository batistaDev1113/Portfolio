# Agent runbook

Operational notes for agentic / automated runs against this repo. Read this
**before** invoking `gh pr merge` or evaluating a CI gate.

## gh CLI: `gh pr merge --yes` does not exist

`gh 2.96.0` does **not** recognize `--yes` on `gh pr merge`. Calling it raises
`unknown flag: --yes` and exits non-zero — and prior agentic runs that piped the
output through `tail` masked the failure because `$?` was capturing `tail`'s
always-0 exit code, not `gh`'s. Result: claimed merges never landed on
`origin/main`.

### Pattern to avoid

```bash
# WRONG (silent-fail in gh 2.96.0): the `--yes` flag is unknown.
gh pr merge $N --admin --squash --delete-branch --yes
```

### Canonical merge pattern (proven working)

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
`critical` level. Any `critical` advisory blocks auto-merge; the five long-known
`high`-severity advisories are accepted as the project's accepted-risk envelope
(`.npm`-transitive: `js-yaml`, `postcss`, `sharp`).

When staging a merge, run `npm audit --omit=dev --audit-level=critical`
locally + surface `failure: 0` explicitly rather than trusting the GitHub-side
rollup which can briefly flicker `FAIL` while status checks rerun.

## Comments on `app/styles/globals.css` discovery comment (PR #75)

The discovery-only `@theme {}` block added previously by PR #75's discovery audit
must be deleted at the start of any Tailwind v4 migration PR — see ADR 0009 +
`.tmpdraft/migration-pr-body.template.md` for the full sequence.
