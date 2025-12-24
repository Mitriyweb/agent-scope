# Change: Phase 1 — Core Configuration (MVP)

## Why

Phase 0 established the project foundation. Phase 1 defines the core primitives that enable agent-scope to function as a configuration and orchestration tool. Agents, roles, and context (scope) are the fundamental concepts that all subsequent phases depend on. Without these, the tool cannot manage AI agents or their responsibilities.

## What Changes

- Define agent configuration schema (name, role, scope)
- Implement agent registry with file-based persistence
- Create role system with built-in standard roles (developer, qa, architect, reviewer)
- Support custom role definitions with validation
- Implement context/scope system with file and directory-based scoping
- Add read-only vs read-write access flags
- Create CLI commands for agent and role management
- Implement validation for agent definitions and configurations

## Impact

- Affected specs: `agent-configuration`, `role-system`, `context-scope`, `cli-commands`
- Affected code: New modules in `src/agents/`, `src/roles/`, `src/context/`, CLI command handlers
- Enables: Phase 2 (specifications & contracts), Phase 3+ (agent flows and execution)
- Breaking changes: None (new functionality only)
