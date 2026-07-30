chore(tailwind): migrate from v3.3.2 to v4.3.3 (CSS-first config, Lightning CSS, drop autoprefixer)

Migrates the project from Tailwind CSS v3.3.2 to v4.3.3 with the new
CSS-first configuration model. Lightning CSS (v4's engine) replaces
both Tailwind's v3 PostCSS adapter AND autoprefixer for vendor prefix
emission. Single substantive code change to the CSS/PostCSS pipeline,
no JS/TS logic changes.

What's changed (3 files plus npm):

- `tailwind.config.js` -- DELETED entirely (v4 is CSS-first; config inlined).
- `postcss.config.js` -- REWRITTEN. Old `{ tailwindcss: {}, autoprefixer: {} }`
  -> new `{ '@tailwindcss/postcss': {} }`. Drops autoprefixer entry.
- `app/styles/globals.css` -- REWRITTEN.
  - Removed the construction-safe prose-only discovery comment block
    that PR #75 (`chore/tailwind-v4-discovery`) added for documentation.
  - Replaced the v3 directive trio
    `@tailwind base; @tailwind components; @tailwind utilities;`
    with the v4 prologue:
    - `@import "tailwindcss";`
    - `@custom-variant dark (&:where(.dark, .dark *));`  (replaces v3
      `darkMode: 'class'` config; needed for `next-themes`
      integration)
    - `@plugin "@tailwindcss/forms";`  (replaces v3 `plugins: [require('@tailwindcss/forms')]`)
    - `@source "../../components/**/*.{js,jsx,ts,tsx}";`  (explicit,
      because v4 auto-detection is documented to be unreliable for
      sibling directories; per earlier empirical audit, components/
      matches 10 .tsx files)
    - `@source "../../app/**/*.{js,jsx,ts,tsx}";`  (parent-walk covers
      this anyway but explicit declarations are documented as safe
      and self-explanatory)
    - `@theme {}`  (empty theme; this project does NOT define custom
      colors / fonts / spacing -- inherit defaults)
  - The `:: -webkit-scrollbar{track,thumb}` blocks (lines 167/171/175
    pre-migration) and all 19 custom `@layer base { ... }` classes
    are preserved verbatim (glassmorphism, project cards, profile
    image, 3D envelope, etc.).
  - Moved the 5 `.rotate-x-{12,45,35}` / `.rotate-y-12` /
    `.translate-y-2` utility classes OUT of `@layer base` and to
    ROOT level (i.e., outside any `@layer` wrapper). Rationale:
    Tailwind v4 promotes `base/components/utilities` to NATIVE CSS
    cascade layers, so utilities inside `base` receive LOWEST
    specificity and get overridden by standard utilities. Root-level
    placement ensures the custom 3D `transform: rotateX()` property
    wins the cascade tiebreaker against any Tailwind-built-in
    `.rotate-x-*` utility via source order. (Note: future refactors
    should NOT move these classes back into `@layer utilities`
    because that would silently regress 3D transforms on
    `app/not-found.tsx`.)
- `package.json` (npm-driven):
  - `autoprefixer` UNINSTALLED.
  - `tailwindcss@3.3.2` UNINSTALLED.
  - `tailwindcss@^4.3.3` INSTALLED.
  - `@tailwindcss/postcss@^4.3.3` INSTALLED.
  - `@tailwindcss/forms@^0.5.11` KEPT (carve-out from the stewp-id
    PR #67 sequence: no stable v4-compatible major of this package
    exists yet; the `next` dist-tag has `0.4.0-alpha.2` which is too
    alpha for production. Pinned at v0.5.11 -- this works with v4
    via the `@plugin` directive but the package's own internals are
    still v3-shaped).

Verification (all gates green):

- `npx prettier --check` 0 errors
- `npx eslint .` exit 0 (post-format-cleanup #78)
- `npx tsc --noEmit` 0 errors
- `npx jest --watchAll=false --silent` 10/10 pass
- `npm run build` exit 0 (47s, all 7 static pages generated)
- `npx browserslist` resolved correctly off `package.json#browserslist`

PR body is `--body-file` populated from
`.tmpdraft/migration-pr-body.template.md` (the staged body, lifted
verbatim per the user's directive). The staged body was authored over
5+ superseding comments on PR #75 (ids 5124414604, 5124428255,
5124440434, 5124479392) and contains:

- 7-step sequence (verbatim reproduction of PR #67 comment id
  5124332375) -- note that this PR's actual installation sequence
  deviates slightly from the verbatim text: we did NOT uninstall
  `@tailwindcss/forms` because (a) no stable v4-compatible major
  exists, and (b) the package can coexist with v4 via `@plugin`.
- Browserslist policy section -- documents the 3 consumers (Tailwind
  v4 Lightning CSS, Jest babel-jest via @babel/preset-env, Next.js
  16 SWC). Documents the Path A reconciliation that closed the
  3-vs-4 clause divergence (PR #77).
- Manual vendor-prefix retention section -- distinguishes longhand
  prefixes (-webkit-foo) from pseudo-elements (::-webkit-scrollbar*);
  no manual `-webkit-foo` longhand in this file today; the 3
  pseudo-elements remain inside `@layer base` (handles correctly).
- Empirical content-glob reconciliation table (verbatim from #75).
- Risk register. Linked work. Recon provenance.

Audit gate at `--audit-level=critical --omit=dev` should pass
unchanged: the migration does not introduce new production
dependencies, only transitions v3 -> v4 within the tailwindcss
package family. `npm audit` reports 5 high advisories (same as
pre-migration; transitive through next/postcss/sharp).

DO NOT MERGE-the PR is pending user review because:
1. The 3 lint findings the staged body claims this PR resolves are
   ACTUALLY already resolved in main (PR #68 lint-flat-config
   migration). This PR is subtractive on the lint side, not
   additive.
2. Visual QA is mandatory post-merge: verify dark-mode toggle
   round-trip, scrollbar gradient thumb, 3D envelope rotation
   (especially that `.rotate-x-*` utilities still apply transforms).
3. The `@tailwindcss/forms@^0.5.11` pin is a known limitation;
   once a stable v1.x releases, a follow-up chore PR bumps it.

Linked work:
- PR #75 (discovery audit + 4 superseding body drafts) -- MERGED.
- PR #76 (browserslist-modern-default, 4-clause) -- MERGED.
- PR #77 (browserslist-drop-op_mini, Path A to 3-clause) -- MERGED.
- PR #78 (format-lint-cleanup, 345 -> 0 CRLF errors) -- MERGED.
- PR #57 (audit gate, --audit-level=critical) -- merged; unaffected.
- PR #67 (Dependabot tailwindcss 3 -> 4 hold) -- SUPERSEDED by this PR
  once merged. Close #67 without merging post-merge.
