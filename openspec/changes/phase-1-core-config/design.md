# Phase 1 — Core Configuration Design

## Context

Phase 1 introduces the core data model and CLI interface for agent-scope. The system must support:

- Multiple agents with distinct roles and responsibilities
- Flexible scoping (file/directory-based access control)
- Built-in standard roles for common use cases
- Custom role definitions for specialized workflows
- File-based configuration for reproducibility and version control

This is the MVP phase—focus on minimal viable functionality that enables Phase 2 and beyond.

## Goals / Non-Goals

### Goals

- Define stable agent, role, and context primitives
- Implement file-based configuration persistence
- Provide CLI interface for agent and role management
- Enable validation of agent configurations
- Support both built-in and custom roles

### Non-Goals

- Agent execution or workflow orchestration (Phase 3+)
- Specification validation beyond agent definitions (Phase 2)
- Advanced permission systems or role inheritance (defer to Phase 2+)
- Web UI or API (defer to Phase 3+)

## Decisions

### Agent Configuration Format

**Decision**: Use JSON for agent configuration files (`.agent.json` or `agents.json`).

**Rationale**:

- JSON is widely supported and easy to parse
- Integrates well with Node.js ecosystem
- Can be validated with JSON Schema
- Human-readable while maintaining structure

**Example**:

```json
{
  "agents": [
    {
      "name": "backend-dev",
      "role": "developer",
      "scope": {
        "directories": ["src/backend"],
        "readOnly": false
      }
    }
  ]
}
```

### Role System

**Decision**: Implement roles as enum-based built-in types with optional custom role support.

**Rationale**:

- Built-in roles (developer, qa, architect, reviewer) cover 80% of use cases
- Custom roles allow flexibility for specialized workflows
- Enum enforcement aligns with project conventions
- Validation can be strict for built-in, flexible for custom

**Built-in Roles**:

- `developer`: Can read/write code, run tests
- `qa`: Can read code, run tests, report issues
- `architect`: Can read all, design decisions, review PRs
- `reviewer`: Can read code, approve changes

### Context/Scope System

**Decision**: Implement scoping as directory/file patterns with read-only flags.

**Rationale**:

- Directory-based scoping is intuitive and aligns with filesystem structure
- Read-only flag provides simple access control
- Glob patterns enable flexible matching
- Deterministic resolution prevents ambiguity

**Example**:

```json
"scope": {
  "patterns": ["src/**/*.ts", "tests/**"],
  "readOnly": false
}
```

### CLI Commands

**Decision**: Implement subcommands under `agent-scope` for agent and role management.

**Rationale**:

- Consistent with Phase 0 CLI structure
- Extensible for future commands
- Clear separation of concerns

**Commands**:

- `agent-scope init` — Initialize project configuration
- `agent-scope agent add` — Add new agent
- `agent-scope agent remove` — Remove agent
- `agent-scope agent list` — List all agents
- `agent-scope role list` — List available roles
- `agent-scope validate` — Validate configuration

## Risks / Trade-offs

### Risk: Configuration file format locks in schema

**Mitigation**: Use JSON Schema for validation. Schema can evolve with migration path for existing configs.

### Risk: Role system too rigid

**Mitigation**: Support custom roles from the start. Built-in roles are defaults, not constraints.

### Risk: Scope patterns become complex

**Mitigation**: Start with simple directory patterns. Add glob support incrementally if needed.

## Migration Plan

Phase 1 is additive—no migration needed from Phase 0. However:

- Phase 2 will extend agent configuration with specification references
- Phase 3+ will add execution context and state management

## Open Questions

- Should agent configuration be per-file (`.agent.json`) or project-wide (`agents.json`)?
- Should roles support inheritance or composition?
- How should scope conflicts be resolved (e.g., overlapping patterns)?
- Should custom roles have validation rules or be free-form?
