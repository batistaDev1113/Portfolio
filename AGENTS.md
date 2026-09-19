# Agent guidance

This file defines the current operating rules for agents working in this Next.js
portfolio project. Keep historical incident details in ADRs or operational
documentation rather than expanding this runbook.

## Project baseline

- Use Node.js 22.x, as specified by `.node-version`.
- Use npm and preserve `package-lock.json`.
- Do not remove `legacy-peer-deps=true` from `.npmrc` until the documented upstream
  peer-dependency conditions have been verified and the full install/test gate passes.
- Keep secrets in local environment files or configured CI secrets; never commit
  `.env.local`, credentials, API keys, or production data.

## Repository exploration

- Inspect the relevant route, component, data boundary, API handler, and tests
  before changing behavior.
- Prefer existing project patterns over introducing new abstractions.
- Use the repository's ADRs in `docs/adr/` for architectural decisions and record
  significant new decisions there.
- Graft and Graphify are optional. If either is installed or configured later:
  use Graft for source navigation and exact edit locations, and Graphify for
  architecture-level relationship analysis. Do not require either tool when the
  affected files are already obvious.

## Next.js, React, and TypeScript

- Follow the existing Next.js 16, React 19, and TypeScript patterns.
- Prefer strict types and type inference; avoid `any` and use `unknown` when a
  value's type is genuinely uncertain.
- Keep server/client boundaries explicit. Do not move code to the client merely
  to avoid designing an appropriate server boundary.
- Keep reusable UI in `components/`, route and API behavior in `app/`, content in
  `data/`, and shared server/data logic in `lib/` or `db/` according to nearby
  patterns.
- Preserve accessibility, keyboard behavior, focus management, semantic HTML,
  reduced-motion support, and responsive behavior when changing UI.
- Add or update unit, component, route, or Playwright tests for behavior changes
  and regressions.

## Styling and formatting

- Use the existing Tailwind v4 token system and CSS custom properties instead of
  hardcoded colors or duplicated design values.
- Preserve light/dark theme behavior and use semantic token names.
- Prefer scalable CSS units and the existing project styling conventions.
- Run `npm run format` only when intentionally formatting files; it modifies files.
- Review the diff after any formatter or auto-fixing command.

## Verification

Run the smallest relevant checks first, then the applicable full gate.

- `npm run lint:check` — run ESLint without modifying files.
- `npm run lint` — run ESLint with supported fixes; this changes files and is not
  a read-only verification command.
- `npx tsc --noEmit` — check TypeScript without emitting files.
- `npm test -- --watchAll=false` — run Jest once without watch mode.
- `npm run build` — run the production build, including `prebuild` dependency checks.
- `npm run build && npm run test:e2e` — build before running Playwright locally;
  the E2E web server expects the production build in `.next/`.
- `npm audit --omit=dev --audit-level=critical` — run the production dependency
  security gate used by CI.
- Report every verification command run and any limitation in the final response.

## Known local environment limitation

On Windows Git Bash, `npm run lint:check` can experience a known ESLint cold-start
timeout. Do not weaken the ESLint configuration or retry indefinitely with larger
timeouts. If it times out without a lint diagnostic, run targeted ESLint checks
where possible and rely on the Linux CI check for the full repository gate.

## Security and dependency operations

- Treat `npm audit --omit=dev --audit-level=critical` as the production dependency
  gate; do not dismiss critical findings without documenting the decision.
- Use `scripts/audit-tally.mjs` and `scripts/audit-leaf.mjs` when reconciling a
  saved `npm audit --json` report, following their documented command arguments.
- Do not change dependency overrides, `.npmrc` peer-dependency behavior, or audit
  thresholds solely to make a check pass.
- Do not contact external services, modify production systems, or use production
  credentials without explicit user approval.

## GitHub and change safety

- Do not push, merge, bypass branch protection, delete branches, or trigger
  deployment-related actions unless the user explicitly requests it.
- Before any requested `gh pr merge`, verify the installed command's supported
  options with `gh pr merge --help`; never assume an unsupported `--yes` option
  exists.
- Never infer command success from piped output. Capture and check the original
  command's exit code before reporting success.
- Do not modify unrelated files or generated output unless the task requires it.
- Do not use broad cleanup commands that could remove user work.
- Follow the repository's conventional-commit PR title style:
  `feat|fix|chore|docs|style|refactor|test|ci|build|perf: description`.
- Never add AI, assistant, automation, generated-with, or co-author attribution
  to commits, commit messages, pull requests, or code comments.

## Long-running commands

Do not start these unless the user explicitly asks or the task requires a verified
local run:

- `npm run dev`
- `npm run start`
- Playwright UI/debug mode
- Docker commands
- File watchers

When a long-running process is necessary, state why it is being started and stop
it cleanly after verification.
