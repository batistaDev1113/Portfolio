## chore(tailwind): migrate from v3.3.2 to v4.x (CSS-first config, Lightning CSS, drop autoprefixer)

> **STAGED DRAFT** — not opened yet. Co-located with PR #75 (discovery) so the v3→v4 migration body is self-contained. When the actual `chore/tailwind-3-to-4-migration` PR is opened, lift this body verbatim and replace branch references as needed.
>
> **Supersedes the prior staged comments on PR #75 (id `5124414604`, `5124428255`, `5124440434`)**. Version 4 of this staged template.
>
> **Change in this revision:** dropped the `not op_mini all` clause from the documented `browserslist` config to match the user's literal recommendation (`["last 2 versions", "not dead", "not IE 11"]`). All four reasoning sections of the previous revision (Background, Why migrate, What changes in this PR, Manual vendor-prefix retention, etc.) are preserved verbatim except for this clause removal.
>
> **Live vs staged divergence note:** The live `origin/main` `package.json#browserslist` field was set by PR #76 (`chore/browserslist-modern-default`, merged 2026-07-29T23:34:04Z) to the 4-clause variant `["last 2 versions", "not dead", "not IE 11", "not op_mini all"]`. This staged body records the user's literal 3-clause preference. If reconciliation is desired, the user can open a follow-up `chore/browserslist-drop-op_mini` PR; otherwise the live state and the staged body intentionally differ on this single clause.

### Background

- **Discovery audit**: PR #75 (`chore/tailwind-v4-discovery`). Documents the empirical reconciliation between v3's three explicit `content` entries and Tailwind v4's auto-content-detection defaults.
- **Vendor-prefix policy**: PR #67 (Dependabot hold) comment id `5124332375` (authored by `batistaDev1113`, 2026-07-29T23:13:24Z). **Decision: DROP `autoprefixer@10.5.4`.** The 7-step sequence below is reproduced **verbatim** from that comment so future maintainers do not need to dig through sibling PR comments.
- **Browserslist policy**: documented in this PR body. **Decision: KEEP and define explicitly in `package.json#browserslist`**. The user's directive pre-decided this co-decision alongside the autoprefixer drop.

### Why migrate

- Tailwind v4's CSS-first configuration removes the `tailwind.config.js` maintenance burden.
- Lightning CSS (v4's engine) handles vendor prefixes natively, removing the `autoprefixer` belt-and-suspenders dependency.
- Auto-content-detection in v4 reduces the explicit `content: [...]` array to a (mostly) no-op, with one explicit `@source` directive as a safety net for sibling directories.
- The CSS-first config also unlocks runtime `@theme` token referencing inside components, which the v3 JS-config model does not.

### What changes in this PR

1. **Delete** `tailwind.config.js` entirely (v4 = CSS-first).
2. **Replace** the v3 directive trio (`@tailwind base; @tailwind components; @tailwind utilities;`) in `app/styles/globals.css` with the v4 equivalent prologue (one `@import`, one `@custom-variant`, two `@source` lines, empty `@theme`).
3. **Remove** the construction-safe prose-only discovery block at the top of `app/styles/globals.css` (the block that PR #75 added for documentation purposes; it is no longer needed once the live v4 directives replace the v3 trio).
4. **Update** `postcss.config.js`: replace `tailwindcss: {}` with `@tailwindcss/postcss: {}`; remove `autoprefixer: {}`.
5. **Move** the 5 `.rotate-x-12` / `.rotate-x-45` / `.rotate-x-35` / `.rotate-y-12` / `.translate-y-2` utility classes out of `@layer base` in `app/styles/globals.css` (cascade-layer specificity hazard in v4 native CSS layers).
6. **Update** `package.json`: `npm uninstall autoprefixer @tailwindcss/forms tailwindcss` then `npm install tailwindcss@^4 @tailwindcss/postcss @tailwindcss/forms@<latest>`.
7. **Retain specific vendor pseudo-elements:** Keep the 3 `::-webkit-scrollbar{track,thumb}` declarations at lines 167/171/175 of the discovery-branch `app/styles/globals.css`. See the **Manual vendor-prefix retention** section below for the full policy.
8. **Inherit the co-decided `browserslist` config** from PR #76 (`chore/browserslist-modern-default`, merged). The migration PR does not need to add this field — it is already in `origin/main`. See the **Browserslist policy** section below.

### Browserslist policy

**Decision: KEEP and define explicitly in `package.json#browserslist`.**

Despite dropping `autoprefixer` (per the **Vendor-prefix policy** above and PR #67), the ecosystem-standard `browserslist` configuration remains a hard dependency of three core build/test systems in this stack:

#### Consumers (post-autoprefixer-drop)

1. **Tailwind v4 (Lightning CSS)** — Lightning CSS reads `browserslist` to determine which modern CSS properties still need vendor-prefix fallbacks AND which browser versions to drop from the output cascade. Without an explicit config, Lightning CSS silently falls back to its built-in default. The explicit config keeps intent documented.
2. **Jest / `@babel/preset-env`** — `babel-jest@^30.4.1` and `@babel/preset-env@^7.23.3` are in `devDependencies`. The Jest transform pipeline reads `browserslist` to determine the JS-syntax target the tests are compiled for. Without explicit config, Babel applies an older default that emits redundant polyfills.
3. **Next.js 16 SWC compiler (Turbopack + Webpack paths)** — Next.js's SWC reads `browserslist` directly (via `next/dist/build/babel/preset.ts` and the SWC-internal `Browserslist` query) for JS-downleveling targets, unless `swcTargets` is set explicitly in `next.config.js`. This project has no explicit `swcTargets`, so SWC relies entirely on the `browserslist` field.

#### Proposed `package.json#browserslist` value (USER'S LITERAL RECOMMENDATION)

```json
"browserslist": [
  "last 2 versions",
  "not dead",
  "not IE 11"
]
```

This is the user's literal recommendation per the directive: `["last 2 versions", "not dead", "not IE 11"]` — three clauses, no `not op_mini all`.

| Clause | Effect |
|---|---|
| `last 2 versions` | Include the current release and the previous one of each browser family. Modern default. |
| `not dead` | Exclude browsers with <0.5% global market share that are unsupported by their vendor (e.g., IE 11, older Opera Presto, UC Browser for Android). This clause ALSO excludes IE 11 and Opera Mini implicitly. |
| `not IE 11` | Explicit IE 11 exclusion. Already covered by `not dead` on browserslist 4.x. Kept for clarity-of-intent (a future maintainer reading the config alone should not need to know what `not dead` excludes). |

**Note on the divergent live state (PR #76):** The merged live state on `origin/main` currently includes an additional `not op_mini all` clause as a low-cost bundle-size enhancement (Opera Mini's proxy JS engine skips `class` / arrows / modern syntax, forcing unnecessary polyfills). This staged body documents the user's literal 3-clause preference; the two are not aligned. If reconciliation is desired, open a follow-up `chore/browserslist-drop-op_mini` PR. If the user prefers to KEEP the 4-clause variant on main, simply **ignore** this staged body's clause count when lifting into the actual migration PR — the migration PR will inherit whatever `browserslist` is currently on `origin/main` and need not modify it.

#### Placement: `package.json#browserslist` field

- **Preferred over `.browserslistrc`** for repo-clarity (no extra dotfile, centralized config).
- Matches the convention used by other tooling that supports inline config (`package.json#prettier`, `package.json#eslintConfig`, `package.json#commitlint`).
- One less file the next maintainer has to find and understand.

#### Execution timing

The browserslist config change is **already implemented** as PR #76 (`chore/browserslist-modern-default`, merged 2026-07-29T23:34:04Z). The current `origin/main` `package.json#browserslist` is the live source-of-truth. The migration PR will inherit whatever is in `package.json#browserslist` at the time it opens. No additional action required in this migration PR.

**Disambiguation:** If the user wants this staged body's documenting clause count (3 clauses) to MATCH the live state, two paths:

- **Path A:** Drop the `not op_mini all` clause from `origin/main` (`chore/browserslist-drop-op_mini` PR, single-line edit, separate from this migration PR). When this migration PR opens, both states AND the staged body all use the 3-clause variant.
- **Path B:** Keep the 4-clause variant on `origin/main` indefinitely. When this migration PR opens, just remove the `### Browserslist policy` section entirely (or replace it with a one-line pointer: "browserslist config is set by PR #76 and is not modified here").

#### Re-admission criterion

If Lightning CSS's auto-prefix behavior, Jest's JS-target compile, or Next.js SWC's downleveling ever needs adjustment for a specific browser, OVERRIDE this `browserslist` field rather than expanding it. Adding comments or per-tool `target` annotations should be the rare exception; the central config is the single source of truth.

### Manual vendor-prefix retention

The original work this discovery prereqs asks us to track two distinct prefixing decisions for `app/styles/globals.css`. They are documented separately because conflating them leads to incorrect cleanup PRs ("these are redundant, just delete them" is wrong for pseudo-elements).

#### Vendor-prefix LONGPREFIXED (e.g., `-webkit-backdrop-filter`, `-moz-transform`)

- The file uses **UNPREFIXED `backdrop-filter`** declarations (4 sites: `.button-about`, `.hero-card`, `.tech-tag`, `.glassmorphism-modal`). There is **NO `-webkit-backdrop-filter`** anywhere in the file today.
- Tailwind v4's **Lightning CSS** handles auto-prefixing according to the project's `browserslist` (see the **Browserslist policy** section above). We trust Lightning CSS + the explicit `browserslist` for longhand prefixes.
- **Re-admission criterion:** Add a manual `-webkit-` LONGPREFIXED declaration ONLY IF a specific browser matrix requires a prefix that Lightning CSS's auto-emission misses AND the surface is on a real visitor hit (not a niche feature). The duplicated declaration is CSS-harmless (last-one-wins cascade) and serves as belt-and-suspenders for older Safari / Chrome variants.
- **Cleanup criterion:** Do NOT remove unprefixed `backdrop-filter` declarations assuming Lightning CSS will auto-prefix them. The unprefixed form is the standardized CSS; the `-webkit-` form is the legacy fallback. Both SHOULD be present (the unprefixed form is what newer browsers read; the `-webkit-` form is what older browsers read).

#### Vendor-specific PSEUDO-ELEMENTS (e.g., `::-webkit-scrollbar`, `::-moz-placeholder`)

- The file contains **EXACTLY 3** vendor-specific pseudo-element declarations, all on `::-webkit-scrollbar{track,thumb}` (lines 167/171/175 of the discovery-branch `app/styles/globals.css`). They style a **gradient thumb** on the scrollbar — an AESTHETIC customization that the standardized `scrollbar-color` / `scrollbar-width` CSS **cannot replicate**.
- Lightning CSS does **NOT** auto-emit pseudo-elements that don't exist in the standardized CSS spec. These are NOT a candidate for autoprefixer-style emission or auto-cleanup.
- **Re-admission criterion:** Only remove if the project explicitly migrates to standardized scrollbar-styling (e.g., `scrollbar-color` + `scrollbar-width`) AND the maintainer accepts the visual regression.

#### Broader principle

- LONGPREFIXED vendor-prefixes (`-webkit-foo`, `-moz-foo`, etc.) are CSS-harmless duplicates if both forms appear — the CSS cascade's last-one-wins rule resolves any conflict.
- PSEUDO-ELEMENTS (`::-webkit-foo`, `::-moz-foo`, etc.) are NOT auto-prefix candidates and removing them changes rendering.
- Do NOT conflate the two when proposing cleanup PRs. Lint rules that flag "redundant" `-webkit-foo` declarations are miscalibrated if they also flag `::-webkit-foo` ones.

#### Baseline check (post-migration verification)

```bash
grep -nE -- '-webkit-' app/styles/globals.css
```

- **Current baseline (pre-migration):** `3` matches (the scrollbar pseudo-element block).
- **Post-migration target:** `3` matches — same exact text.
- **Regression:** `> 3` matches means the migration introduced a new manual `-webkit-` declaration. Investigate whether it was intentional and whether Lightning CSS would have auto-emitted it anyway.
- **Silent change:** `< 3` matches means a maintainer removed a vendor-specific pseudo-element. Confirm the visual regression was intentional before merging.

### 7-step migration sequence (verbatim from PR #67's autoprefixer-policy comment)

The following block is reproduced word-for-word from PR #67 comment id `5124332375`. Do not edit. If PR #67's policy ever changes, update BOTH places.

> 1. `npm uninstall autoprefixer @tailwindcss/forms tailwindcss`
> 2. `npm install tailwindcss@^4 @tailwindcss/postcss @tailwindcss/forms@<latest>`
> 3. `postcss.config.js` rewrite: `tailwindcss: {}, autoprefixer: {}` → just `@tailwindcss/postcss: {}`
> 4. `tailwind.config.js`: delete; move `@custom-variant dark (&:where(.dark, .dark *));` + `@plugin "@tailwindcss/forms";` into the top of `globals.css` below the new `@import "tailwindcss";`
> 5. Move the 5 `.rotate-x-*` / `.translate-y-2` utility classes out of `@layer base` (cascade-layer specificity hazard).
> 6. Run `npm run lint:check && npx tsc --noEmit && npx jest --watchAll=false && npm run build`.
> 7. Manual visual QA: dark-mode toggle, all 3D envelope / perspective effects on `app/not-found.tsx` and related components.

### Empirical content-glob reconciliation (verbatim from PR #75 discovery)

| v3 entry | Files matched in this repo | v4 migration action |
|---|---|---|
| `public` directory + recursive walk + `.html` filter | **0** (public actually holds SVG, WebP, PDF, PNG) | NO-OP — neither v3 nor v4 needs a SOURCE directive for this path |
| `components` directory + recursive walk + `{js,jsx,ts,tsx}` filter | **10** tsx files (all 10 component files) | SAFE-ADD an explicit `@source` directive for `components/`, because v4 auto-detection walks upward from the CSS file location and may miss SIBLING directories that sit beside `app/` |
| `app` directory + recursive walk + `{js,jsx,ts,tsx}` filter | **7** entries (FOUR tsx: page, layout, not-found, global-error; THREE ts: route handler, robots config, sitemap config) | SAFE-NO-OP — v4's upward parent walk from `globals.css` reaches the `app/` directory automatically |

Files v4 will incidentally pull beyond the v3 list (no harm because they contain no Tailwind class strings):

- `db/fetchData.ts` (server-side only)
- `data/projects.json` (data file)

### Verification plan (post-migration)

- `npx eslint .` — must report 0 errors. The migration is expected to **resolve** the 3 outstanding v3-era lint findings:
  - `<a href="/">` → `<Link href="/">` swap in `app/not-found.tsx`
  - `<a href="/">` → `<Link href="/">` swap in `components/Navigation.tsx`
  - `setMounted(true)`+`useEffect` pattern → `useSyncExternalStore` idiom in `components/ModeToggle.tsx`
- `npx tsc --noEmit` — 0 errors.
- `npx jest --watchAll=false` — 10 tests green.
- `npm run build` — must succeed. The build-failure case is the cascade-layer specificity rebalancing: defining utilities in `@layer base` in v4 gives them LOWEST specificity, so existing standard utilities override them, possibly silently breaking 3D transforms on `app/not-found.tsx`. Mitigation is step 5 of the sequence above.
- `grep -nE -- '-webkit-' app/styles/globals.css` — must return **3** matches (the scrollbar pseudo-element block). See the **Baseline check** subsection above.
- Confirm `package.json#browserslist` matches the value resolved in the **Browserslist policy** section above (or Path A / Path B as documented there if reconciling with PR #76).
- Manual visual QA — dark-mode toggle round-trip; 3D envelope rotation around `envelope-back` / `envelope-flap` / `envelope-body`; `.rotate-x-*` utilities applied to elements; gradient thumb on the scrollbar.

### Risk register

- **Cascade-layer specificity** on `.rotate-x-*` / `.translate-y-2`: v4 promotes `@layer base/components/utilities` to NATIVE CSS cascade layers, so utilities inside `base` get the lowest specificity. Standard utilities will override them. Mitigated by step 5 of the sequence above.
- **v4 missing source detection for sibling dirs**: v4's upward parent walk from the CSS file is documented to be unreliable for sibling directories. Mitigated by the explicit `@source` for `components/`.
- **`@tailwindcss/forms` v4-compatible major**: the latest `@tailwindcss/forms` is in the v0.5.x line. If a v1.x is published that targets v4 specifically, prefer it; otherwise stay on v0.5.x.
- **`next@16.x` + Tailwind v4 + Lightning CSS**: the PostCSS pipeline ordering matters. `critters` (the optimizeCss helper from `next.config.js`) and `@tailwindcss/postcss` must both run before the HTML minifier; verify via `npm run build` output that CSS asset sizes shrink post-migration (Lightning CSS's emission is more compact than PostCSS+autoprefixer's).
- **Accidental cleanup of `::-webkit-scrollbar*`**: a future maintainer (or LLM-assisted refactor) might propose removing the 3 scrollbar pseudo-element rules as "redundant vendor prefixes." They are NOT redundant; they are an aesthetic customization. The **Manual vendor-prefix retention** section above documents this. The baseline check (`grep -nE -- '-webkit-' app/styles/globals.css` returning 3) catches any silent deletion.
- **`browserslist` config drift**: a future maintainer might delete the `package.json#browserslist` field alongside the autoprefixer drop, believing them to be the same concern. They are NOT the same: see the **Browserslist policy** section above for the three consumers that remain post-autoprefixer-drop.
- **Live vs staged browserslist divergence** (documented): the live `origin/main` has the 4-clause variant (via PR #76); this staged body documents the 3-clause variant. See the **Browserslist policy** section for Path A / Path B reconciliation options.

### Linked work

- **PR #75** (`chore/tailwind-v4-discovery`) — merged before this PR opens (or co-merged).
- **PR #67** (Dependabot tailwindcss 3 → 4 hold) — SUPERSEDED by this PR. Close #67 without merging after this PR merges.
- **PR #76** (`chore/browserslist-modern-default`) — MERGED on `origin/main`. Sets the live `package.json#browserslist` field. The migration PR inherits this config and does not modify it. NOTE: PR #76 used the 4-clause variant; this staged body documents the 3-clause variant. See **Browserslist policy** for divergence reconciliation.
- **PR #57** (audit gate at `--audit-level=critical`) — unaffected.
- **PR #66** (`@types/node` 22 → 26 bump) — unaffected.

### Recon provenance

- **Discovery recon date**: 2026-07-29
- **Policy decision date (autoprefixer)**: 2026-07-29 (PR #67, comment id `5124332375`)
- **Policy decision date (vendor-prefix retention)**: 2026-07-29 (this staged draft, version 2)
- **Policy decision date (browserslist)**: 2026-07-29 (this staged draft, version 3 → 4)
- **Migration draft prep date**: 2026-07-29
- **Maintainer sign-off required before merge**: yes (single-maintainer portfolio — the maintainer IS the user)
