# Change: Add Phase 2 — Spec-Driven Development (SDD)

## Why

To move the project from "Vibe Coding" to structured AI orchestration, aligning with the project principles of Spec-Driven Development (SDD) and Context Engineering. This phase establishes the core workflows for specification, planning, and task execution.

## What Changes

- [ ] Initialize `BACKLOG.md` with Phase 2 items derived from `ROADMAP.md`.
- [ ] Implement the `Specify` workflow (Requirements and Acceptance Criteria).
- [ ] Implement the `Plan` workflow (Architecture and API contracts).
- [ ] Implement the `Tasks` workflow (Execution mapping).
- [ ] Establish standardized directory structure for artifacts.
- [ ] Add support for "Embedded Plan Mode".
- [ ] Integrate OpenSpec validation into the default development flow.

## Impact

- **Affected specs**: `openspec/project.md` (updated to reflect new workflows)
- **Affected code**: CLI commands related to orchestration and artifact management.
- **Priority**: HIGH
- **Estimated effort**: L (1-2 weeks)
- **Roadmap phase**: Phase 2 — Spec-Driven Development (SDD)
- **Roadmap item**: Multiple items under Phase 2

## Acceptance Criteria

- [ ] `BACKLOG.md` contains all sub-items from Phase 2 with proper mapping.
- [ ] New directory structure (`specs/`, `plans/`, `tasks/`, `contracts/`) is documented and supported.
- [ ] "Embedded Plan Mode" is functional and enforced where applicable.
- [ ] `openspec validate` is integrated and passes for all new artifacts.

## Dependencies

- Phase 1 (Agent Memory & Skills) must be completed (marked as [x] in ROADMAP.md).

## References

- **Backlog item**: Phase 2 — Spec-Driven Development (SDD)
- **Created**: 2025-12-29
- **Roadmap**: ROADMAP.md

## Notes

- This proposal initializes the transition to SDD.
- Individual capabilities (Specify, Plan, Task, Implement) may be broken down into further proposals if complexity warrants.
