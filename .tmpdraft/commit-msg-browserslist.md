chore(deps): add browserslist modern-default config to package.json

Add a centralized `browserslist` field to `package.json` so the build/test
pipeline has explicit, documented browser targets.

Config: ["last 2 versions", "not dead", "not IE 11", "not op_mini all"]

Why:
- Tailwind v4's Lightning CSS reads browserslist to determine which
  modern CSS properties need vendor-prefix fallbacks (and which can be
  pruned).
- `@babel/preset-env` + `babel-jest` (the Jest transform pipeline)
  read browserslist to determine JS-syntax downleveling targets.
- Next.js 16's SWC compiler (Turbopack path) reads browserslist
  directly (this project has no explicit swcTargets in
  next.config.js, so SWC relies on browserslist for JS-downlevel
  emit targets).

This is a prerequisite for the future chore/tailwind-3-to-4-migration
PR which drops autoprefixer (per PR #67 audit-policy decision, comment
id 5124332375). Without an explicit browserslist field, all three
consumers silently fall back to older defaults.

The "not IE 11" clause is redundantly covered by "not dead" on
browserslist 4.x but is kept for clarity-of-intent (a future maintainer
reading the config alone should not need to know what "not dead"
excludes).

The "not op_mini all" clause excludes Opera Mini (whose proxy JS engine
skips class syntax and arrow functions, forcing unnecessary polyfills).
Market share is below 0.5% globally; the bundle-size benefit outweighs
the visitor-count reduction.

Linkage:
- Discovery audit (CSS-first migration prep): PR #75
- autoprefixer-drop policy: PR #67 comment id 5124332375
- Migration PR body draft: .tmpdraft/migration-pr-body.template.md

Verification:
- node JSON.parse: valid JSON
- npx browserslist: resolves to 22 target environments
- npx tsc --noEmit: 0 errors
- npx jest --watchAll=false: 10/10 passed
- npm run build: succeeded in 10.8s, all routes generated

Co-decided with the autoprefixer-drop policy (PR #67) per the user's
directive: keep browserslist config (NOT drop) + explicitly configure
the modern default.
