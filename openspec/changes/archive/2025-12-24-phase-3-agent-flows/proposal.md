# Change: Phase 3 — Agent flows

## Why

Phase 2 establishes specifications as contracts between agents. Phase 3 makes agent interaction explicit and verifiable through directed flow definitions, enabling complex multi-agent workflows with clear ownership of artifacts and context handoff.

## What Changes

- Implement DAG-based flow definitions for explicit agent interaction
- Add flow correctness validation (input/output matching, cycle detection)
- Introduce artifact-based context passing (no implicit global context)
- Establish clear ownership and lifecycle for produced artifacts
- Add CLI commands for flow visualization and validation

## Impact

- Affected specs: `agent-flows`, `context-handoff`
- Affected code: New modules in `src/flows/`, `src/artifacts/`
- Enables: Phase 4 (developer tooling, templates)
- Breaking changes: None (additive to Phase 2)
