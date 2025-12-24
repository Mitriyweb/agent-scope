# Change: Phase 0 — Project Bootstrap

## Why

The agent-scope project needs foundational infrastructure to support development of core features. Phase 0 establishes the repository structure, CLI entry point, TypeScript configuration, testing framework, and documentation baseline required for subsequent phases.

## What Changes

- Create standardized repository structure (src/, bin/, docs/, tests/)
- Establish TypeScript with strict compiler options and absolute path imports
- Implement CLI entry point with enum-based command routing
- Set up Jest testing framework with 80% coverage threshold
- Add comprehensive project documentation (README, ROADMAP, contribution guidelines)
- Set up license and governance files
- Define project conventions: strict TypeScript, enums over unions, test-driven development
- Enforce tests as mandatory sub-tasks in all implementation tasks

## Impact

- Affected specs: `project-bootstrap`
- Affected code: Repository root, package.json, CLI scaffolding, TypeScript configuration
- Enables: All subsequent phases depend on Phase 0 completion with TDD and strict typing
