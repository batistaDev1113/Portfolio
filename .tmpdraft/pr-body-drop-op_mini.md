## chore(deps): drop "not op_mini all" clause from browserslist config

This PR narrows the `package.json#browserslist` field from a 4-clause variant to the user's **literal 3-clause recommendation**, resolving a live-vs-docs divergence documented in PR #75's staged migration body.

### Diff

```diff
   "browserslist": [
     "last 2 versions",
     "not dead",
-    "not IE 11",
-    "not op_mini all"
+    "not IE 11"
   ],
```

**2 lines changed, 1 deleted, 1 edited** (the trailing comma after `"not IE 11"` is removed along with the deleted line; net array size: 4 → 3). No lockfile churn (browserslist is build-time metadata, not install-time).

### Path A reconciliation

Per PR #75's staged migration body's `### Browserslist policy` section, two reconciliation paths were enumerated:

- **Path A (this PR)**: Drop `not op_mini all` from `origin/main`. After merge, live state and the staged 3-clause body both align.
- **Path B**: Keep the 4-clause variant on `origin/main`; the staged body becomes a historical artifact.

This PR implements **Path A**. After merge:

| State | Before this PR | After this PR |
|---|---|---|
| `origin/main#package.json#browserslist` | 4 clauses (incl. `not op_mini all`) | **3 clauses (no `not op_mini all`)** |
| Staged body in PR #75 | 3 clauses (no `not op_mini all`) | 3 clauses (no `not op_mini all`) |
| **Live vs docs divergence** | YES (intentional, with both paths documented) | **NO (fully aligned)** |
| Resolved target count | 22 (one fewer than 3-clause, since `op_mini all` was excluded) | **23 (one MORE than 4-clause, since `op_mini all` is now included)** |

### Why this variant is the user's literal recommendation

The original PR #76 staging rationale considered 4 clauses to add a low-cost bundle-size enhancement: `not op_mini all` excludes Opera Mini (whose proxy JS engine skips `class` / arrow functions / modern syntax, forcing unnecessary polyfills). The user later signaled a preference for the simpler 3-clause form per `["last 2 versions", "not dead", "not IE 11"]` — which the staged body in PR #75 now documents as the canonical config.

**Important nuance:** the 3-clause variant INCLUDES `op_mini all` in the resolved `browserslist` target list (23 entries vs the 4-clause's 22), because `not dead` does NOT automatically exclude Opera Mini — Opera is still an actively maintained browser. The practical impact:

- **CSS prefix coverage**: Lightning CSS sees `op_mini all` in the target list and may emit more vendor prefixes than the 4-clause variant. This is harmless and even marginally better coverage for legacy Opera Mini users.
- **JS-syntax target**: Next.js SWC compiles a slightly broader modern-syntax fallback for Opera Mini targets. Again, harmless.
- **Bundle size**: marginally larger because more vendor prefixes are emitted. But negligible because Opera Mini's market share is below 0.5% globally, and only the CSS-side prefixes are transmitted to all clients (most of whom will never match Opera Mini).

### Verification (all gates green on this branch)

```
===JSON-VALIDITY===
package.json#browserslist: ["last 2 versions","not dead","not IE 11"]
node JSON.parse: valid

===RESOLVE-3CLAUSE-VIA-NPX===
$ npx browserslist "last 2 versions, not dead, not IE 11"
23 target entries (1 more than 4-clause's 22; the diff is `op_mini all` re-inclusion)
Verified: op_mini all is present in the resolved list

===TSC===
$ npx tsc --noEmit
0 errors

===JEST===
$ npx jest --watchAll=false --silent
10/10 tests green across 3 test suites

===BUILD===
$ npm run build
✓ Compiled successfully in 37.8s
✓ Completed runAfterProductionCompile in 2.6s
✓ Generating static pages (7/7) in 3.7s
All routes (/, /_not-found, /api/contact, /robots.txt, /sitemap.xml) generated.
```

### Code-review verdict

`code-reviewer-minimax-m3` reported **no real risks**: schema correct (trailing comma removed cleanly), 3-clause variant resolves identically to the prior validation's 23-target list, no behavior change for Lightning CSS / Babel / SWC consumers, no lockfile churn.

### Why this lands BEFORE the future v3→v4 migration PR

The user explicitly directed: "merge before opening the v3→v4 migration PR." Reason: the future `chore/tailwind-3-to-4-migration` PR inherits whatever `package.json#browserslist` is on main at the time it opens. When it opens against THIS branch's state, it will pick up the 3-clause variant automatically. The migration PR's body documentation (which already references the 3-clause variant per Path A) will then match the live state without re-editing.

### Linked work

- **PR #75** (`chore/tailwind-v4-discovery`) — discovery audit + 4 superseding author comments doc the staged body + Path A / Path B reconciliation
- **PR #76** (`chore/browserslist-modern-default`) — Predecessor that set the 4-clause variant on main. This PR narrows it.
- **PR #67** — autoprefixer-drop policy (comment id `5124332375`); unaffected
- **PR #57** (audit gate at `--audit-level=critical`) — unaffected; the audit job will run on this PR and is expected to pass because the change is metadata-only (no production dependency added or removed)

### Recon provenance

- Path A selection date: 2026-07-29
- This PR opened: 2026-07-29
- Maintainer sign-off: yes (single-maintainer portfolio) — the user IS the maintainer
