# ADR 0011: The PR-chain collapse pattern (post-merge consolidation ADR)

- **Status:** Accepted
- **Date:** 2026-07-30
- **Implementation PRs (epochs):**
  - Epoch 1: PRs [#50](https://github.com/batistaDev1113/Portfolio/pull/50) - [#56](https://github.com/batistaDev1113/Portfolio/pull/56) (initial cleanup wave + audit-gate origin)
  - Epoch 2: PRs [#66](https://github.com/batistaDev1113/Portfolio/pull/66), [#67](https://github.com/batistaDev1113/Portfolio/pull/67), [#69](https://github.com/batistaDev1113/Portfolio/pull/69) (Dependabot tailwind v4 + babel/preset-env held)
  - Epoch 3: PRs [#102](https://github.com/batistaDev1113/Portfolio/pull/102) - [#105](https://github.com/batistaDev1113/Portfolio/pull/105), [#107](https://github.com/batistaDev1113/Portfolio/pull/107) (tool-quirks + audit-gate workflow fix)
  - Closure ADRs: PR [#108](https://github.com/batistaDev1113/Portfolio/pull/108) (ADR #0010), PR [#109](https://github.com/batistaDev1113/Portfolio/pull/109) (AGENTS.md cross-ref)

## Context

Four recurring PR-chain collapses observed in this conversation. In
each, several small focused PRs ship independently first; once the
pattern is fully understood, a single ADR captures the audit trail +
design rationale as the closure artifact. Without it, the audit trail
is fragmented across PR comment threads and forces future readers to
paginate.

## Decision

Adopt the **three-step constraint** for any agentic toolchain-decision
episode:

1. Ship the focused PR (lock in the change; don't conflate multiple
   decisions in a single PR).
2. Write the ADR as the closure artifact once the pattern is fully
   understood (audit-trail preservation; future readers consult).
3. Cross-link both: PRs reference ADRs, ADRs reference PRs, and (per
   ADR #0010 + PR #109 round-trip) AGENTS.md cross-references the
   ADR family.

**Triggers** (when to invoke the three-step constraint):

- ≥3 related PRs land in close succession (within one toolchain
  cycle); or
- a recurring pattern emerges across multiple PRs (the same
  failure-mode crosses PR boundaries); or
- the audit trail would otherwise fragment across PR comment
  threads.

## Cross-references

- Sibling ADRs: [ADR #0009](https://github.com/batistaDev1113/Portfolio/blob/main/docs/adr/0009-drop-babel-toolchain.md) (Babel toolchain collapse via PRs #69, #83); [ADR #0010](https://github.com/batistaDev1113/Portfolio/blob/main/docs/adr/0010-tool-quirks-journey.md) (tool-quirks collapse via PRs #102-#105, #107).

— Authored post-merge of PR #109 on 2026-07-30; mirrors
  `0010-tool-quirks-journey.md` format subset (Status + Date +
  Implementation PRs + Context + Decision + Cross-references).
