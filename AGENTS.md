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

Companion in-repo ADR: [`docs/adr/0010-tool-quirks-journey.md`](https://github.com/batistaDev1113/Portfolio/blob/main/docs/adr/0010-tool-quirks-journey.md) — captures the multi-turn basher-shape + gh-file-path-resolution failure-mode audit trail discovered while authoring this runbook (PRs #102-#105).

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
- Chained small bashers (`<=4 KB each`) for `git ls-files | xargs git rm --` + branch cleanup — used in PR #100.- Heredoc at top-level basher command (`<< 'EOF'\n… body …\nEOF`) for multi-paragraph body when the command is short — used in PR #100 `.tmpdraft` cleanup.



## Tool quirks: `npm run lint:check` cold-start timeout on Windows Git Bash

A second recurring failure mode in agentic runs: spawning a basher that runs `time npm run lint:check` (= `eslint .`) on **Windows Git Bash with `core.autocrlf=true`** consistently times out at 60-180s. Root cause is `eslint-config-next/core-web-vitals` preset cold-start latency under the Windows Node 22 file-resolution stack — not a code or config regression in `eslint.config.js`. The same command runs normally (~30s) on the CI Linux runner in `.github/workflows/`. Symptom: a basher `time npm run lint:check 2>&1 | tail -40` invocation hits the basher's 90s/180s/360s timeout with **no stderr output captured** — the interface is silent during the cold-start. Practical cost: 1-3 retry turns per episode (re-running with progressively larger timeouts that don't help), based on the most recent content-ship turns (observed during PR #118 `feat(content): update Hero bio + title`).

### Operational discipline

- **Trust CI `lint:check` as the source of truth.** Any Linux GitHub-Actions runner in `.github/workflows/*` reports the gate in ~30s. Treat any local Windows Git Bash `eslint .` timeout as an env lock, **not** as evidence of an actual lint regression. Do not gate the merge on the local ESLint run while CI is still queued.
- **Do not downgrade the gate** to recover from the env lock. Specifically: avoid `--max-warnings 999`, avoid removing `lint:check` from `npm scripts`, avoid commenting-out `eslint-plugin-jsx-a11y` rules. Each of those weakens the real `lint:check` enforcement that CI is running and silently regresses project hygiene.
- **Don't retry with progressively larger timeouts.** The cold-start latency is environmental — `eslint .` either completes in ~30s (success path) or hangs for the full `core.autocrlf=true` Windows-Node22 timeout window. Any basher timeout ≥180s is the env lock confirmed — cap invocations of this command at 180s and trust CI rather than retrying at 360s.
- **Self-resolves if dev env moves to Linux.** WSL2, Codespaces, or any Linux-based dev container sidesteps the cold-start entirely. No code action needed; the only durable fix is changing the primary dev environment, not the project's `lint:check` script.

### Self-test

- Hit the basher timeout with `rc=$?` matching `gh`'s actual exit code (rather than `tail`'s always-0 echo) and no stderr? → It's the cold-start env lock; trust CI. Don't loop.
- CI's `lint:check` job itself failed with a real lint error message? → That's a real regression; iterate on the lint finding (use `npx eslint --no-warn-ignored path/to/file.tsx` for targeted diagnosis), not on the basher timeout.

### Working example

PR #118 (`feat(content): update Hero bio + title to Senior Frontend Engineer`) shipped despite local Windows `npm run lint:check` timing out at 180s on the agentic basher. The code-reviewer verdict was SHIP, `tsc --noEmit`/`jest --watchAll=false`/`prettier --check` all green locally, and CI's Linux `lint:check` (in `.github/workflows/dependency-review.yml`) reported SUCCESS on PR #118's run. The local Windows timeout was correctly diagnosed as the env lock, not a code issue — and the merge proceeded via the canonical safe pattern (`gh pr merge --admin --squash --delete-branch --body-file`) without any gate downgrade.



## Tool quirks: Playwright `webServer` requires prior `npm run build`

A small follow-up to the `pretest:e2e` lifecycle-hook decision (CR-NIT-2 from the post-NIT-3rd-pass review of `chore/playwright-hero-regression-test`): `npm run test:e2e` does **NOT** auto-build the production app. `.github/workflows/e2e-hero.yml`'s explicit `name: Build production app` step sequences `npm run build` immediately before `npm run test:e2e`, so CI is unaffected. But local shells (developer machines, agent basher invocations, ad-hoc `npm run test:e2e:ui` debugging) MUST run `npm run build && npm run test:e2e` manually for the playwright `webServer` to find a `.next/` build directory. The previously-attempted `pretest:e2e` npm hook (`npm run build` before every `test:e2e` invocation) was removed because it would have caused a CI double-build (workflow builds, then pretest hook re-builds). **Operational discipline:** always prefix local `npm run test:e2e` / `npm run test:e2e:ui` invocations with `npm run build` to ensure the playwright webServer starts cleanly. **Symptom of forgetting:** playwright will fail loudly with `url 'http://localhost:3000' didn't respond` within the `webServer.timeout: 120_000` window (set in `playwright.config.js`), surfacing the build-missing failure as a playwright timeout (NOT a confusing 'why did next dev fail' message). The `playwright.config.js` header comment also documents this sequence, but this AGENTS.md entry is the canonical reminder for agentic runs.


## Audit tooling snapshots

`scripts/audit-tally.mjs` and `scripts/audit-leaf.mjs` (introduced by the `chore/audit-scripts` PR for the Issue #114 audit-tracker turn) reconcile `npm audit --json`'s `meta.vulnerabilities.high` (propagation-path count through the dep graph, includes multi-path chains aggregated) against the **distinct leaf-cert GHSA count** (the actual upstream fixes needed). Re-run on any new audit snapshot:

    node scripts/audit-tally.mjs audit.json 8    # group-by-package top-8 summary
    node scripts/audit-leaf.mjs audit.json       # canonical meta-vs-leaf reconciliation

Used in the body of [Issue #114](https://github.com/batistaDev1113/Portfolio/issues/114) (Track upstream unblock: next@16.2.13+ …) and any future audit-tracker issue. CR-SHIP-verdicted twice each during the original authoring turn.
