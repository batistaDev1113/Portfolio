# ADR 0012: Free-tier chat provider selection and quota-abuse limits

- **Status:** Accepted
- **Date:** 2026-11-07
- **Implementation PRs:**
  - [#197](https://github.com/batistaDev1113/Portfolio/pull/197) — dead model ids, honest 429 vs. 503, selection caching (`a738732`)
  - [#198](https://github.com/batistaDev1113/Portfolio/pull/198) — Groq as primary provider, quota-scope-aware fallback (`da1d320`)

## Context

`/api/chat` was failing for every visitor with an opaque "Something went
wrong". Diagnosis against the live provider found two independent causes:

1. **Dead model ids.** Three of the six hardcoded OpenRouter `:free` ids
   returned 404 (`nvidia/nemotron-3-super-120b-a12b`,
   `poolside/laguna-xs-2.1`, `z-ai/glm-5.2`). Only 12 `:free` models were
   still served.
2. **Exhausted quota, reported as the wrong failure.** The account was on
   OpenRouter's free tier: `is_free_tier: true`, capped at **50 requests
   per day, account-wide**. Every probe returned
   `429 free-models-per-day`, the route answered `503`, and the UI invited
   the user to "try again" when retrying could not help.

Two structural problems made this worse than the incidents themselves:

- The probe ran before **every** message, costing 2 requests per message
  (probe + stream), so the effective ceiling was ~25 messages/day for all
  visitors combined.
- A 429 on a free-tier account is account-wide, yet the loop walked all
  six candidates anyway — spending six requests to collect one error.

Capacity was also a design choice with no data behind it: writing "free
models" into a hardcoded list without a test or a re-verification command
is what let the list rot silently.

## Decision

**Use Groq as the primary provider, with OpenRouter retained as a
runtime fallback.**

Groq exposes the same OpenAI chat-completions API, so
`@ai-sdk/openai` drives both — no new dependency, and the
dependency/audit posture from [#194] is unchanged. Verified before
writing code that both endpoints answer in OpenAI's error shape
(Groq `401`, Gemini `400`).

Provider selection resolves at request time, Groq first:

```ts
if (process.env.GROQ_API_KEY) return GROQ;
if (process.env.OPENROUTER_API_KEY) return OPENROUTER;
return null;
```

The ordering is a **deployment-safety property**, not a preference: if
`GROQ_API_KEY` is missing from the hosting environment, the chatbot stays
on OpenRouter rather than returning `500 not configured`. Merging or
deploying ahead of the secret cannot take the site down.

**Fallback strategy depends on how the provider meters quota.** This is
the part most likely to be re-broken later, so both branches are pinned
by tests:

| Provider | Meters | On 429 |
| --- | --- | --- |
| OpenRouter | per account | `break` — every candidate is exhausted |
| Groq | per model | `continue` — the next model has its own budget |

Carrying OpenRouter's `break` over to Groq would discard three models'
worth of daily quota on the first 429.

**Model ids are verified against the live key, not against documentation.**
`GET /api.groq.com/openai/v1/models` returned four chat models on this
account: `allam-2-7b`, `openai/gpt-oss-120b`, `openai/gpt-oss-20b`,
`qwen/qwen3.8-27b`. `llama-3.1-8b-instant` — which has the largest
published daily budget (14.4K RPD) and appeared in more than one
third-party table — **is not enabled for this key** and was removed
rather than left to 404 on every probe.

**Per-IP limits gain a daily bucket, and the claim is kept honest.**

```
MINUTE_WINDOW_MS  60_000      MAX_PER_MINUTE  10   — stops a burst
DAY_WINDOW_MS     86_400_000  MAX_PER_DAY     40   — bounds one caller's day
```

The daily bucket exists because provider quota is per model and per day:
without it, one visitor could pace themselves at 10/minute and consume
the day's budget, leaving every subsequent user with a 429.

### Deliberately not done: a global in-memory counter

A naive "max N requests/day for the whole site" counter was considered
and rejected. On Vercel each instance holds its own module state, so:

- a caller distributed across N instances gets roughly N× the limit;
- a cold start silently resets everything;
- the counter would therefore *look* like protection while providing
  none, which is worse than an honestly-scoped per-IP cap.

Real enforcement requires shared state (Upstash Ratelimit or Vercel KV).
That is a new dependency and a new failure mode for a chat widget on a
portfolio site, so it is deferred — recorded here so the deferral is a
decision with a rationale rather than an oversight.

## Consequences

**Positive**

- Chatbot works at $0 with ~200 estimated messages/day (3 × 200K TPD on
  the gpt-oss/qwen models plus 500K on the backstop), versus ~25/day and
  a hard failure before.
- Quota exhaustion surfaces as `429` with "try again tomorrow"; a dead
  model id no longer kills the request.
- A working model selection is cached for 10 minutes, so steady state
  costs one request per message instead of two.
- No new runtime dependency.

**Negative / accepted risks**

- **The per-IP caps are best-effort on serverless.** Documented in the
  code comment and above; the shared-state fix is deferred knowingly.
- **A single determined caller can still consume a day's budget** by
  spreading across IPs. The failure mode is graceful (clean `429` copy),
  but availability for a day is lost.
- **Free tiers change without notice.** Groq's published limits and this
  account's model catalogue are both outside our control. The route
  tolerates a vanished id; it cannot tolerate a revoked key.
- Groq's `gpt-oss` models have an 8K TPM ceiling and the system prompt
  alone is ~1,500 tokens (`lib/resumeContext.ts`), so bursts throttle on
  tokens before requests.

## Verification

- **End-to-end in production**, not assumed: `POST /api/chat` against the
  live site returned `HTTP 200 text/event-stream` in 1.5s and streamed
  *"He most commonly works with React (including Next.js), Angular, and
  Vue.js (often with Vuetify)."* with zero error frames.
- 17 tests in `__tests__/chat-route.test.ts`, including: OpenRouter
  preferring/falling back correctly, no-provider `500`, probe targeting
  `provider.baseURL`, Groq spending all four candidates on 429 versus
  OpenRouter spending one, the cache not leaking across providers, the
  11th request in a minute blocked, and **one IP unable to outlive
  `MAX_PER_DAY` by waiting out the minute cap**.
- `lint:check`, `tsc --noEmit`, `jest`, and `next build` all green;
  GitNexus `detect-changes` reported risk low with 0 affected processes.

## What would change this decision

- **$10 of OpenRouter credit** raises that account to 1,000 requests/day
  — more capacity than the current free arrangement, and it would make
  OpenRouter the better primary again. The fallback code already supports
  flipping the order.
- **Sustained traffic** makes the deferred shared-state limiter mandatory,
  and likely a paid tier, since ~200 messages/day is a hobby ceiling.
- **Groq restricting free access** returns us to OpenRouter's 50/day, at
  which point the honest options are credits or a different provider.
  Gemini was evaluated and skipped only because Google no longer
  publishes free-tier numbers publicly, so no verified limit could be
  stated.

[#194]: https://github.com/batistaDev1113/Portfolio/pull/194
