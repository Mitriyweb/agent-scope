# Change: Phase 2 — Specifications & contracts

## Why

Phase 1 defines agent configuration and roles. Phase 2 makes specifications a strict contract between agents, enabling safe composition and preventing silent failures when agents don't meet each other's expectations.

## What Changes

- Implement OpenSpec-compatible specification files for agents
- Add JSON Schema validation for specifications
- Enforce producer → consumer contracts
- Fail-fast on contract mismatch
- Provide clear error messages for specification violations

## Impact

- Affected specs: `openspec-support`, `contract-enforcement`
- Affected code: New modules in `src/specs/`, `src/contracts/`
- Enables: Phase 3 (agent flows and explicit interaction)
- Breaking changes: None (additive to Phase 1)
