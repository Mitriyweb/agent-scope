## Context

Completing Phase 2 requires making the SDD workflow "self-hosting" — the CLI should enforce the same rules the project documents describe.

## Goals

- Functional enforcement of "Embedded Plan Mode".
- Automated project health checks (`validate`).
- Consistency between roadmap, backlog, and task lists.

## Decisions

### Decision: Roadmap Matching Strategy

To handle bold formatting and potential punctuation, the sync logic will use a "fuzzy-ish" match that strips `**`, `:`, and trailing periods from both the roadmap line and the backlog field value before comparison.

### Decision: Embedded Plan Mode Enforcement

The `implement` command will look for `plans/<change-id>.md` or `plans/<change-name>.md`. This ensures developers (and AI) think about the "How" before "What".

## Risks

- False positives in roadmap sync if item names are too generic.
  - _Mitigation_: Encourage unique, descriptive roadmap item names.
