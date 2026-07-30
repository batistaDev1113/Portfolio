## Vendor-prefix policy: pre-decision recorded for the v3→v4 migration

**Decision: DROP `autoprefixer@10.5.4` from both `package.json` and `postcss.config.js`** as part of the Tailwind v3→v4 migration. Rationale + re-admission criterion below.

### Why drop

1. **Tailwind v4.0+ uses Lightning CSS** as its under-the-hood engine, which handles vendor-prefix emission natively for the standard set of properties (`-webkit-`, `-moz-`, `-ms-`, `-o-` prefixes for `backdrop-filter`, `mask-image`, `transform`, `transition`, etc.). For Lightning CSS's coverage list, autoprefixer is redundant.
2. **Portfolio blast radius is minimal** — no customer PII, no production surface that depends on a specific browser version. The few properties that need prefixing are already covered manually in `app/styles/globals.css` (e.g., `-webkit-backdrop-filter: blur(...)` next to `backdrop-filter: blur(...)`).
3. **Maintenance cost** — `autoprefixer@10.5.4` is on its own minor track; updating it adds an audit + lockfile churn with zero practical benefit when Lightning CSS covers it.
4. **Bundle size** — `autoprefixer` plus its `browserslist` + `caniuse-lite` transitive costs ~150KB in `node_modules`; trimming it shrinks `npm ci` install time and reduces audit noise (a stale `caniuse-lite` data file produces false-positive advisories).

### What this preserves

- **Manual `-webkit-` vendor prefixes in `app/styles/globals.css`** (e.g., the `backdrop-filter` declarations) — these are author-written, untouched by this decision. They remain as a belt-and-suspenders fallback for any browser Lightning CSS's prefix list doesn't cover.
- **`@tailwindcss/postcss` (the v4 PostCSS adapter)** — this is what replaces v3's `tailwindcss: {}` entry. Required. Different package, different name — we are NOT removing the entire PostCSS pipeline, just the autoprefixer step.

### Re-admission criterion

Re-add `autoprefixer` if and only if:

- A specific browser support requirement emerges that **Lightning CSS does not cover** AND **cannot be replicated with a manual `-webkit-` prefix in source** AND **is on a surface a real visitor would hit** (NOT a niche feature).

`autoprefixer` is NOT a default dependency — it's a defensive add-on only. If the trigger above fires, open a `chore/re-add-autoprefixer` PR that documents the specific edge case (with the GHSA / browser matrix / measurable-rendering-impact rationale) and re-introduces the plugin in `postcss.config.js`.

### Migration sequence (carry into the actual v3→v4 PR)

1. `npm uninstall autoprefixer @tailwindcss/forms tailwindcss`
2. `npm install tailwindcss@^4 @tailwindcss/postcss @tailwindcss/forms@<latest>`
3. `postcss.config.js` rewrite: `tailwindcss: {}, autoprefixer: {}` → just `@tailwindcss/postcss: {}`
4. `tailwind.config.js`: delete; move `@custom-variant dark (&:where(.dark, .dark *));` + `@plugin "@tailwindcss/forms";` into the top of `globals.css` below the new `@import "tailwindcss";`
5. Move the 5 `.rotate-x-*` / `.translate-y-2` utility classes out of `@layer base` (cascade-layer specificity hazard).
6. Run `npm run lint:check && npx tsc --noEmit && npx jest --watchAll=false && npm run build`.
7. Manual visual QA: dark-mode toggle, all 3D envelope / perspective effects on `app/not-found.tsx` and related components.

— Recorded 2026-07-29 during the `chore/lock-line-endings` triage follow-up. To be carried verbatim into the actual `chore/tailwind-3-to-4-migration` PR body when it's opened.
