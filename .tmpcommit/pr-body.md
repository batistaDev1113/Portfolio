## Discovery-only PR for a future Tailwind v3 to v4 migration

This PR is **comments-only**. No behavior change. It preempts the actual migration by recording an empirical audit of what a future v3-to-v4 migration PR will need to address.

### What this PR does

Prepends a ~165-line comments-only block to `app/styles/globals.css`. The block contains four closed CSS-comment sections:

1. **Header** -- branch, scope (no behavior change), and notation rule.
2. **PRE-MIGRATION AUDIT** -- empirical reconciliation between v3's content-glob entries in `tailwind.config.js` and Tailwind v4's auto-content-detection defaults.
3. **DRAFT (directives)** -- prose summary of the v4 directive set that the future migration PR will activate.
4. **DRAFT (config comparison)** -- prose reproduction of the v3 `tailwind.config.js` this discovery will eventually supersede.

The existing v3 directive trio (`@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`) below the new comment block is **untouched**. Tailwind v3 still emits the same CSS output as before this PR.

### Empirical audit findings (what the migration PR will face)

The v3 `tailwind.config.js` content array listed three explicit globs:

| v3 glob | Files actually matched in this repo | v4 migration action |
|---|---|---|
| `public` + recursive walk + `.html` filter | **0** (public holds SVG, WebP, PDF, PNG only) | NO-OP -- neither v3 nor v4 needs a SOURCE directive for this path |
| `components` + recursive walk + `{js,jsx,ts,tsx}` filter | **10** tsx files | SAFE-ADD an explicit SOURCE directive in the migration PR, because v4 auto-detection walks upward from the CSS file's location and may not reach sibling directories that sit beside `app/` |
| `app` + recursive walk + `{js,jsx,ts,tsx}` filter | **7** entries (FOUR tsx: page, layout, not-found, global-error; THREE ts: route handler, robots config, sitemap config) | SAFE-NO-OP -- v4's upward parent walk reaches the app directory automatically |

Files v4 will incidentally pull beyond the v3 list (no harm): `db/fetchData.ts` (server-side only, no class strings) and `data/projects.json` (data file, no class strings).

### Migration plan (what the future PR will do)

When the actual `chore/tailwind-3-to-4-migration` PR lands:

1. **Delete this discovery block** at the top of `app/styles/globals.css` (it is replaced by live v4 directives in the migration PR).
2. **Replace the v3 directive trio** with the v4 directives summarized in section 3 of the discovery block.
3. **Delete `tailwind.config.js`** (v4 is CSS-first; config moves into `globals.css` via `@theme` and friends).
4. **Update `postcss.config.js`**: rename the `tailwindcss` plugin entry to reference the v4 scoped postcss adapter, and drop the `autoprefixer` plugin entry (v4 uses Lightning CSS internally for vendor prefixing; manual `-webkit-` prefixes already in source cover the few browser-specific cases).
5. **Install**: `tailwindcss@^4` and the v4 scoped postcss adapter.
6. **Uninstall**: `tailwindcss@3.x` and `autoprefixer@10.x`.

### Notation rule (and the bug this PR's author hit twice)

The discovery block deliberately avoids writing any recursive file-glob pattern verbatim. The canonical recursive form (`two-asterisks slash asterisk`) contains the byte pair `slash-star slash-star` which closes a CSS comment early and exposes the rest as bare CSS that PostCSS fails to parse. The earlier authoring attempts in this conversation contained unsafe patterns and crashed `npm run build` twice with `CssSyntaxError: Unknown word` errors. This PR's prose-only notation rule prevents recurrence.

### Verification

```
===LINT===
$ npx eslint app/styles/globals.css
0 errors, 1 warning (file ignored -- no matching config; expected for CSS)

===TSC===
$ npx tsc --noEmit
(no output, 0 errors)

===JEST===
$ npx jest --watchAll=false --silent
pass 0 fail 0 -- all 10 tests green

===BUILD===
$ npm run build
✓ Compiled successfully in 10.0s
✓ Completed runAfterProductionCompile in 1118ms
✓ Generating static pages using 8 workers (7/7) in 1707ms
```

The `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;` directives are still present on lines 134-136 of the modified file, confirming the v3 active CSS is intact.

### When to merge this PR

This PR is ready to merge as-is. It is intentionally a no-op for runtime behavior. Its value is purely documentation: the next maintainer who opens a Tailwind v3-to-v4 migration PR can lift the migration sequence above verbatim into their PR body and proceed with high confidence about which SOURCE directives will be needed.

It can also be **closed without merging** if the maintainer prefers to start the migration directly -- the comments can be discarded and the v4 directive set rewritten fresh, since the discovery is fully self-documenting.

### Related open work (NOT in this PR)

- PR #67 (Dependabot `tailwindcss` 3 to 4 bump) is **on hold** pending a real migration. This PR does not unblock it.
- PR #57 (audit gate at `--audit-level=critical`) is merged and unaffected.
- The `chore/lock-line-endings` PR (.gitattributes normalization) is merged and unaffected.

### Recon provenance

- Recon date: 2026-07-29
- Tool: `find` against `public/`, `app/`, `components/` with matching against v3's explicit content array
- Read: branch is `chore/tailwind-v4-discovery`, base is `main`
