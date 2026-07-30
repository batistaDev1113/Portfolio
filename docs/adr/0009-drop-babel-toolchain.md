# ADR 0009: Drop Babel toolchain, let next/jest's SWC handle tests

- **Status:** Accepted
- **Date:** 2026-07-30
- **Supersedes:** [#69](https://github.com/batistaDev1113/Portfolio/pull/69)
  (`chore(deps-dev): bump @babel/preset-env from 7.28.3 to 8.0.2` —
  closed-not-merged)
- **Tracking issue:** [#81](https://github.com/batistaDev1113/Portfolio/issues/81)
  (auto-closed via `Resolves #81` on [#83](https://github.com/batistaDev1113/Portfolio/pull/83)'s merge)
- **Implementation PR:** [#83](https://github.com/batistaDev1113/Portfolio/pull/83)
  (merged at `c28373d`, `+92 / −1925`, 3 devDeps removed)

## Context

`@babel/preset-env@7.28.3` was held at the patch-level by a Dependabot
PR ([#69](https://github.com/batistaDev1113/Portfolio/pull/69)) because the
canonical Babel 8 upgrade path (`@babel/preset-env@8.0.2`) hit a
peer-dependency conflict with `babel-jest@30.4.1`, which in turn
peer-locked `@babel/core` to a non-`8.0.0` semver range that no shipped
`@babel/core` could satisfy.

The blocking transitive pair (`babel-jest`, `jest`) had not published
a `v31` line as of the resolution date; waiting for upstream to ship was
indefinite. A lower-friction alternative existed: the project's
`next/jest` setup already auto-falls-back to **SWC** compilation when no
Babel config is present. Pre-flight confirmed there was no `.babelrc`,
no `babel.config.*`, and no `babel` imports in `jest.config.js`,
`next.config.js`, or any app/component source. The three BABEL
devDependencies were dead weight on disk only.

## Decision

**Path 4 selected** — drop `@babel/preset-env`, `@babel/preset-react`,
and `babel-jest` from `devDependencies`. Let `next/jest`'s native SWC
compile take over `.tsx` / `.jsx` / `.ts` test compilation. Production
builds already use Next.js's SWC; tests now use the same compiler,
eliminating a class of "tests green, prod broken" divergences.

```diff
# package.json
  "devDependencies": {
    "@tailwindcss/forms": "^0.5.11",
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^26.1.2",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "babel-jest": "^30.4.1",            ← REMOVED
+   # SWC compiles everything; no Jest-side Babel bridge needed.
    "@babel/preset-env": "^7.23.3",     ← REMOVED
    "@babel/preset-react": "^7.23.3",   ← REMOVED
    "critters": "^0.0.25",
    ...
```

## Blocked original 4-clause peer-dependency chain

This is the chain that held PR #69 in `closed-not-merged` until Path 4
became the resolution:

1. `@babel/preset-env@8.0.2` **→** peer `@babel/core: ^8.0.0`
2. `babel-jest@30.4.1` **→** peer `@babel/core: ^7.11.0 || ^8.0.0-0`
3. `jest@30.4.2` **→** no `v31` line published yet
4. `babel-plugin-jest-hoist@30.4.0` **→** no peer constraints, but
   transitively tracking the `babel-jest` line

The `^8.0.0-0` semver suffix in clause 2 accepts Babel 8 **prereleases
only** — it does NOT match `@babel/core@8.0.0` or `@babel/core@8.0.1`
stable releases. So even though `@babel/core@8.x` existed on `npm
latest`, `babel-jest@30.4.1` would emit a peer-dep warning against it
during install. Result: PR #69 could not merge cleanly.

## Considered alternatives (and why Path 4 won)

| Path | Description                                                          | Outcome                                                                                                                                                                                                                                                                                                                          |
| ---- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Wait for `jest@31` / `babel-jest@31` upstream                         | Indefinite blocking on ecosystem cadence                                                                                                                                                                                                                                                                                        |
| 2    | `npm install --force` / `--legacy-peer-deps`                          | Suppresses the warning but does not fix the resolver state; babel-jest still attempted to load on babel-7 chain while `@babel/preset-env@^8` loaded on babel-8 chain during cold install — runtime crash likely                                                                                                                                  |
| 3    | Shrinkwrap-style `overrides` pinning `babel-plugin-jest-hoist`        | Maintenance-burden workaround that masks the conflict                                                                                                                                                                                                                                                                            |
| 4    | **Drop babel entirely; let `next/jest` SWC compile tests**            | **Selected**: zero ecosystem dep, eliminates the conflict class, restores prod/test compiler parity, no Babel version-fragmentation waiting                                                                                                                                                                                    |

Path 4 won on three lower-friction properties: no ecosystem dependency
on a `v31` line that hasn't shipped, zero-config swap because
`next/jest` auto-falls-back to SWC when no Babel config is present, and
production/test SWC-compiler parity.

## What stayed, and why

- **`babel-plugin-react-compiler@^1.0.0`** — kept. It is a Next.js
  SWC-pipeline dependency, not a Babel-toolchain dependency. Its
  runtime is the same SWC compiler used by production builds.
- **`babel-plugin-jest-hoist@30.4.0`** — still appears in
  `package-lock.json` post-cleanup. Pulled directly by
  `jest-runtime@30.0.1` (Jest 29's own runtime), used by Jest test
  execution, not by the Babel transform pipeline. Has no peer
  constraints. This is benign housekeeping documented for future
  reviewers taking `+92 / −1925` lockfile diffs and wondering why a
  Babel-named package still appears.

## Verification (run on PR #83 branch and post-merge on `main`)

| Gate                                         | Result                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------------- |
| `npm run lint:check`                         | exit 0                                                                                |
| `npx tsc --noEmit`                           | exit 0                                                                                |
| `npx jest --watchAll=false`                  | 3 suites, 10/10 tests passing via `next/jest` SWC                                    |
| `npm run build`                              | exit 0 — production assets compile all 6 routes cleanly                                |
| `npm audit --omit=dev --audit-level=critical` | exit 0 — audit gate still holds; no transitive vulns surfaced                        |
| Vercel preview smoke-test (manual)           | `https://portfolio-git-chore-drop-babel-2240ab-…vercel.app` — 7/7 PASS, zero console errors |

A regression net for the SWC-compiled validation branch is captured
in [`__tests__/contact-route.test.ts`](../../__tests__/contact-route.test.ts)
([#84](https://github.com/batistaDev1113/Portfolio/pull/84)). A nightly
prod-smoke cron verifies the live production URL stays clean
([#85](https://github.com/batistaDev1113/Portfolio/pull/85),
[#86](https://github.com/batistaDev1113/Portfolio/pull/86)).

## Consequences

### Positive

- Production / test SWC compiler parity — eliminates the "tests green,
  prod broken" class of issues.
- Babel 8 ecosystem fragmentation is moot for this project. The
  [`@babel/core@8` dist-tag changes](https://www.npmjs.com/package/@babel/core)
  (e.g., `next` moving from a prerelease RC to stable) no longer affect
  this repo.
- Babel ecosystem devDeps (≥110 packages transitively) no longer
  resolve on every install, reducing `npm ci` install time and disk
  footprint.
- The 4-clause peer-dependency chain that gated PR #69 is **removed
  from the dep graph** — not deferred. PR #69 is permanently
  unnecessary even if a future maintainer wants
  `@babel/preset-env@^8.0.2` installed.

### Negative

- A future maintainer who wants custom in-test babel transforms
  (e.g., for some custom pragma) must first re-introduce the
  `babel-jest` package, accepting the original 4-clause blocker
  until `jest@31`/`babel-jest@31` ship.
- `package-lock.json` still transitively contains
  `babel-plugin-jest-hoist@30.4.0` (pulled by `jest-runtime`); a
  future maintainer grepping for `babel` and finding it may be
  briefly confused. Documented above.
- `__tests__/contact-route.test.ts` now requires
  `/** @jest-environment node */` (jsdom v26 doesn't expose
  Web `Request`/`Response` constructors used by the Next.js route
  handler). Isolated to the route-test file only; component tests
  remain on jsdom.

## Reopen criteria

If a future maintainer re-installs `babel-jest` (or any 7.x/8.x-side
Babel tooling), the original 4-clause blocker will re-emerge unless
all three of these conditions are met:

1. `npm view babel-jest@latest peerDependencies` returns a peer range
   that includes `@babel/core: ^8.0.0` (NOT the prerelease-only
   `^8.0.0-0` clause)
2. `npm view jest@latest version` reports a `>=31.x` release
3. `npm view babel-plugin-jest-hoist@latest version` reports a `>=31.x`
   release

Until all three publish, re-introducing `babel-jest` would re-create
the peer-conflict that PR #69 originally surfaced. Path 4 is therefore
the recommended resolution if Babel tooling ever needs to return.

## References

### Primary sources (mirrored to this file)

- Original `closed-not-merged` PR: [#69](https://github.com/batistaDev1113/Portfolio/pull/69)
- Audit-trail comment on PR #69:
  [#69#issuecomment-5125728093](https://github.com/batistaDev1113/Portfolio/pull/69#issuecomment-5125728093)
- Tracking issue: [#81](https://github.com/batistaDev1113/Portfolio/issues/81)
- Resolution PR: [#83](https://github.com/batistaDev1113/Portfolio/pull/83)
- Regression-net test: [#84](https://github.com/batistaDev1113/Portfolio/pull/84)
- Nightly smoke-test cron: [#85](https://github.com/batistaDev1113/Portfolio/pull/85)
- Cron hardening follow-up: [#86](https://github.com/batistaDev1113/Portfolio/pull/86)

### Adjacent context (referenced but not directly mirrored)

- Tailwind v3 → v4 migration: [#79](https://github.com/batistaDev1113/Portfolio/pull/79)
- `.gitattributes` harden (LF/CRLF gate): [#80](https://github.com/batistaDev1113/Portfolio/pull/80)
- Browserslist Path A reconciliation: [#76](https://github.com/batistaDev1113/Portfolio/pull/76),
  [#77](https://github.com/batistaDev1113/Portfolio/pull/77)
- Format cleanup (prettier CRLF fix): [#78](https://github.com/batistaDev1113/Portfolio/pull/78)
- `.tmpdraft/` cleanup (workspace hygiene): [#87](https://github.com/batistaDev1113/Portfolio/pull/87)

### External ecosystem state-of-the-world

- `@babel/core` dist-tags as of 2026-07-30:
  `{ bridge6: '6.0.0-bridge.1', esm: '7.21.4-esm.4', next: '8.0.0-rc.6', latest: '8.0.1' }`
- `jest@latest` = `30.4.2` (no `v31` published)
- `babel-jest@latest` = `30.4.1` (no `v31` published; peer unchanged from this ADR)
- `@tailwindcss/forms@latest` = `0.5.11` (v4-compatible `1.0` still pending; tracked in
  [#82](https://github.com/batistaDev1113/Portfolio/issues/82))

### Local reusable artifact

The dependency finder used during pre-flight and verification:

```bash
# upstream state probe — re-run periodically (info purposes only)
npm view babel-jest@latest peerDependencies
npm view jest@latest version
npm view @babel/core dist-tags
npm view babel-plugin-jest-hoist@latest peerDependencies

# local-state probe — confirms the resolver state matches ADR intent
node -e 'const p=JSON.parse(require("fs").readFileSync("package.json","utf8"));
console.log("babel-related deps in package.json:",
  Object.keys({...p.dependencies||{},...p.devDependencies||{}})
       .filter(k=>/babel/i.test(k)))'
```

## Authoring note

This ADR was authored after the resolution (`PR #83` MERGED,
2026-07-30T02:34Z, commit `c28373d`) so the state described here
reflects a **post-merge** toolchain. Future readers reconstructing the
decision from cold git history should pair this file with:

- `git log` on `main` around commit `c28373d`
- The `__tests__/contact-route.test.ts` body (manifestation of the
  SWC-only toolchain)
- A live run of `npm view` from the **External ecosystem state** table
  above

— [closing cherry-pick to the prior conversation's PR #69 audit-trail
comment on 2026-07-30]
