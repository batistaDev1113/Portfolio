# Agent-readiness remediation

## Objective
Fix AIScan agent-readiness failures for https://www.yuniorbatista.com/ by implementing discovery, content negotiation, bot policy, and API metadata endpoints in this Next.js portfolio.

## Problem
AIScan reports score 36/100 (Level 2 Readable, rubric v2026.08.2) with failing checks: C1, C2, B2, P1, P4, D3, E2.

## Why
Improve machine/agent readability and discovery (markdown negotiation, llms.txt, robots AI rules, API catalog, OAuth discovery metadata, Link discovery headers, OpenAPI description) as requested.

## Scope
- In scope: add/update routes, metadata routes, headers/links, and supporting content for the listed checks; keep existing site behavior intact.
- Out of scope: implementing real OAuth flows, changing unrelated UI/content, dependency upgrades, deployment, git push/merge.

## Constraints
- Follow existing Next.js 16 / React 19 / TypeScript patterns in `app/`.
- Preserve accessibility, security headers, and existing functionality.
- Node 22.x, npm, keep `package-lock.json` and `.npmrc` behavior unchanged.
- Branch creation requested but git CLI unavailable in this environment; record limitation.

## Authorized scope
Modify/add: `app/robots.ts`, `app/llms.txt/route.ts`, `app/openapi.json/route.ts`, `app/.well-known/api-catalog/route.ts`, `app/.well-known/oauth-authorization-server/route.ts`, `app/.well-known/oauth-protected-resource/route.ts`, `app/index.md/route.ts` (or equivalent), `proxy.ts`, `app/layout.tsx`, `next.config.js`, `public/index.md` (if needed), `odd/tasks/agent-readiness-remediation.md`.

## Acceptance criteria
- `/llms.txt` returns markdown per llmstxt.org (H1, summary, ## sections with links).
- `robots` includes explicit allow/deny rules for known AI user-agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, Bytespider, Amazonbot, CCBot, meta-externalagent, cohere-ai, Diffbot, etc.).
- `/openapi.json` serves an OpenAPI 3.1 description for existing API routes and is referenced by API catalog.
- `/.well-known/api-catalog` returns RFC 9727-style catalog linking to OpenAPI service description.
- `/.well-known/oauth-authorization-server` and `/.well-known/oauth-protected-resource` return RFC 8414 / RFC 9728 discovery metadata appropriate to this site.
- Discovery Link header/tag present (`rel="api-catalog"` and/or `describedby` / llms link as appropriate).
- Markdown content negotiation supported (`Accept: text/markdown` serves markdown) and/or `/index.md` published.
- Relevant checks/tests pass or limitations reported.

## Applicable checks
- `npx tsc --noEmit`
- `npm run lint:check` (known Windows Git Bash timeout risk per AGENTS)
- `npm run build` (if feasible)
- `npm test -- --watchAll=false` (targeted/all as relevant)

## Tasks
- [x] T1 Explore codebase and AIScan requirements (robots, layout, config, API routes, existing metadata routes)
- [x] T2 Create feature task document and Engram mirror before source writes
- [x] T3 Add `/llms.txt` endpoint (C2)
- [x] T4 Update robots with explicit AI bot rules and llms/sitemap references as appropriate (B2)
- [x] T5 Add OpenAPI 3.1 document for existing APIs (E2)
- [x] T6 Add `/.well-known/api-catalog` linking to OpenAPI (P1)
- [x] T7 Add `/.well-known/oauth-authorization-server` and `/.well-known/oauth-protected-resource` metadata (P4)
- [x] T8 Add discovery Link header(s) and/or HTML link tags (D3)
- [x] T9 Implement markdown content negotiation and/or `/index.md` (C1)
- [ ] T10 Run applicable verification and record results/limitations

## Progress
- 2026-11-18: Exploration complete. Environment limitation: git/shell and Engram persistence unavailable/unreliable in this environment, so a new branch could not be created automatically and task-doc mirroring could not be fully verified; code changes prepared in working tree.
- Implemented C2: `app/llms.txt/route.ts` serves llmstxt.org-style markdown (`text/plain; charset=utf-8`) with H1, summary, pages/links, machine-readable resources, APIs, projects, and contact.
- Implemented B2: `app/robots.ts` now returns explicit per-agent allow rules for `*`, GPTBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Applebot-Extended, Bytespider, Amazonbot, CCBot, meta-externalagent, cohere-ai, Diffbot; sitemap/host set to canonical `https://www.yuniorbatista.com`.
- Implemented E2: `app/openapi.json/route.ts` serves OpenAPI 3.1 document for `POST /api/chat` and `POST /api/contact` with request/response schemas and server URL.
- Implemented P1: `app/.well-known/api-catalog/route.ts` serves RFC 9727-style `application/linkset+json` linking to OpenAPI `service-desc` and `llms.txt` via `describedby`.
- Implemented P4: `app/.well-known/oauth-authorization-server/route.ts` and `app/.well-known/oauth-protected-resource/route.ts` serve minimal honest discovery metadata (issuer/resource canonical URL, empty supported grants/response types/methods/scopes, no invented working endpoints).
- Implemented D3: `next.config.js` adds global `Link` header (api-catalog, describedby/openapi, help/llms.txt, alternate index.md). `app/layout.tsx` adds `<link rel="api-catalog">`, `<link rel="describedby">`, markdown alternate, and llms help tags.
- Implemented C1: `app/index.md/route.ts` serves markdown homepage/portfolio summary at `/index.md` (`text/markdown; charset=utf-8`, `Vary: Accept`). `proxy.ts` rewrites `/` to `/index.md` when `Accept` includes `text/markdown` (matcher limited to `/` and `/index.md`) to preserve normal HTML for browsers.
- Updated `app/sitemap.ts` to canonical URLs and included key discoverable resources (`/resume`, `/llms.txt`, `/index.md`, `/openapi.json`).

## Verification evidence
- Not run in this environment: shell/git unavailable for `npx tsc --noEmit`, `npm run lint:check`, `npm run build`, or `npm test -- --watchAll=false`.
- Manual static checks: inspected created/edited route files, config, proxy, layout, robots, and sitemap for expected paths, content types, canonical URLs, and preserved existing API/CSP behavior.

## Next step
Run applicable verification in a Node 22/npm environment (`npx tsc --noEmit`, `npm run lint:check` or targeted ESLint, `npm run build`, targeted tests as relevant) and confirm `/`, `/index.md`, `/llms.txt`, `/openapi.json`, `/.well-known/api-catalog`, OAuth well-known routes, Link headers, and Accept negotiation behave as expected. Commit on a dedicated branch when git is available.
