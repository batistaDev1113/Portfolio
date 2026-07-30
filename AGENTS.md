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

## Tool quirks: `basher` shape failure

A recurring failure mode in agentic runs: spawning basher commands of
**~12 KB with nested single quotes inside JSON-escaped content**.
The JSON serialization + bash tokenization interaction mangles the
content, surfacing as

```
bash: -c: line N: unexpected EOF while looking for matching '`'
```

and silently aborting the entire command — not a single sub-line.
`| tail -N` after `gh …` further masks the exit code (tail always
returns 0, not `gh`'s actual exit). Cost this week: **2 retry turns per episode** (the user's literal
"this week alone" estimate), based on recent `--admin --squash
--delete-branch` merge sequences.

### Operational discipline (both, not instead)

- **6 KB cap on the `command` parameter.** When exceeded, **split into
  multiple chained bashers** (each ≤6 KB). Bashers run sequentially;
  2-3 small spawns cost less than 1 failed-and-debug spawn.
- **Body-file writes**: for content destined for `--body-file <path>`
  or `gh api --input <path>`, use plain `printf '%s\n' '...' > path`
  from short simple content. Avoid embedding heredoc-with-single-
  quoted-markers (`<< 'EOF' … EOF`) **inside** the basher `command`
  JSON parameter — JSON-escape + bash-quote interaction bites.
  Heredocs are fine in a stand-alone basher whose command starts
  with `<< 'EOF'`, but the practical discipline is: keep body-file
  writes as `printf` and never entangle heredocs inside a complex
  basher command parameter.
- **`$?` capture**: with any `| tail -N` after `gh …`, capture the
  exit code from `gh` itself:

  ```bash
  set +e; gh …; rc=$?; echo "rc=$rc"; tail -5 …
  ```

  Otherwise `$?` reflects `tail` (always 0), masking any `gh` failure.

- **`gh pr create --body-file <path>` Windows path-resolution gap.**
  Three occurrences this session: passing a relative path (`./file.md`)
  or `$(pwd)/file.md` to `gh pr create --body-file <path>` returns
  `open <path>: The system cannot find the file specified` even when
  an immediate-prior `ls -la <path>` confirms the file is present.
  Symptom: gh CLI arg-parser resolves paths against a different
  effective CWD than the calling shell. Workarounds, in order of
  preference:

  - Write body to `/tmp/gh-body/pr_body.md` via heredoc INSIDE the
    basher command (`cat > /tmp/gh-body/pr_body.md << 'EOF' ... EOF`)
    and pass the absolute `/tmp/` path:
    `gh pr create --body-file /tmp/gh-body/pr_body.md`. Empirical
    validation: end-to-end in PR #104 (heredoc write + content
    delivery). PR #103 used the same `--body-file /tmp/gh-body/pr_body.md`
    open-path but shipped with empty body content due to a separate
    write_file→basher race (recovered separately via
    `gh pr edit --body 'inline'`).

  - For short bodies without `(`, `=>`, or backticks, pass via
    `--body 'inline'` with single-quote wrap. Trim problematic
    characters first (this falls back to the basher-quote landmines
    documented above).

### Self-test before any large basher spawn

- Command body close to 6 KB? → split into chained spawns.
- Heredoc inside complex JSON-escaped content? → refactor to
  `printf '...' > path` or move the heredoc to its own basher.
- `| tail -N` after a `gh …` call? → use the `set +e; gh …; rc=$?`
  pattern above.

### Working examples (do, then verify)

Reference patterns that successfully closed prior episodes:

- `printf '%s\n' '...' > tmp_pr_N_merge.md` + `gh pr merge N --body-file tmp_pr_N_merge.md` — used in PR #98 #100 #101 merges, no debug cycle.
- Chained small bashers (`<=4 KB each`) for `git ls-files | xargs git rm --` + branch cleanup — used in PR #100.
- Heredoc at top-level basher command (`<< 'EOF'\n… body …\nEOF`) for multi-paragraph body when the command is short — used in PR #100 `.tmpdraft` cleanup.


