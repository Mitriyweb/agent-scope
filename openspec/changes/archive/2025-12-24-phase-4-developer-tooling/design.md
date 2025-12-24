# Phase 4 — Developer tooling Design

## Context

Phase 3 delivered DAG-based flows and artifact management. Phase 4 focuses on developer experience: making flows easier to understand, visualize, and scaffold. This is a cross-cutting change affecting CLI commands, error handling, and template scaffolding.

## Goals

- **Improve discoverability**: Help developers understand flows, agents, and roles
- **Enable visualization**: ASCII and text-based graph rendering for terminal environments
- **Reduce boilerplate**: Templates and presets for common patterns
- **Better diagnostics**: Clear error messages with remediation hints
- **No breaking changes**: All new features are additive

## Non-Goals

- GUI/web-based visualization (Phase 5 or later)
- Real-time execution monitoring (Phase 5)
- IDE plugins (Phase 1.5 follow-up)


## Decisions

### 1. ASCII Graph Rendering

**Decision**: Use text-based ASCII graphs for terminal output, not graphical formats.

**Rationale**:

- Works in all terminal environments (SSH, CI/CD, containers)
- No external dependencies (graphviz, etc.)
- Consistent with Unix philosophy (plain text)
- Easy to pipe to other tools

**Alternatives considered**:

- Graphviz/dot format: requires external tool, not portable
- JSON output: useful but not human-readable for quick inspection
- Web UI: out of scope for Phase 4

### 2. Template Structure

**Decision**: Templates are directories with `.template` suffix containing sample configs and flows.

**Rationale**:

- Simple file-based approach, no database needed
- Easy to version control and distribute
- Developers can create custom templates
- Clear separation from actual projects

**Alternatives considered**:

- Embedded in CLI binary: harder to maintain and extend
- Remote template registry: adds complexity, requires network

### 3. Preset Loading

**Decision**: Presets are JSON files loaded from `~/.agent-scope/presets/` or bundled with CLI.

**Rationale**:

- User-customizable without code changes
- Bundled presets work offline
- Simple JSON format, easy to edit
- Follows Unix convention of user config directories

**Alternatives considered**:

- Hardcoded in code: inflexible
- Remote registry: requires network, adds latency

### 4. Error Message Format

**Decision**: Enhanced errors include: message, context, suggestion, and example fix.

**Rationale**:

- Helps developers self-serve without documentation lookup
- Consistent format across all commands
- Actionable suggestions reduce support burden

**Example**:

```text
Error: Flow "my-flow" has a cycle

Context: Node 'analyzer' depends on 'processor', which depends on 'analyzer'

Suggestion: Remove or redirect one of these edges to break the cycle

Example fix:
  Remove edge: analyzer → processor
  Or add intermediate node: analyzer → validator → processor
```


## Risks / Trade-offs

| Risk                                      | Mitigation                                     |
|-------------------------------------------|------------------------------------------------|
| ASCII graphs may be hard to read for large flows | Provide `--format json` option for programmatic use |
| Templates may become outdated            | Version templates, include update instructions |
| Presets may not match user needs         | Allow easy customization and override          |
| Error messages may be too verbose        | Add `--quiet` flag to suppress suggestions     |


## Migration Plan

- Phase 4 is purely additive: no breaking changes
- Existing commands continue to work unchanged
- New commands are opt-in
- Templates and presets are optional

## Open Questions

1. Should `agent-scope explain` be interactive (prompt-based) or flag-based?
   - **Proposed**: Flag-based for scripting, with interactive mode as option
2. Should templates include sample agents and roles?
   - **Proposed**: Yes, with clear comments explaining each part
3. Should presets be versioned separately from CLI?
   - **Proposed**: No, bundle with CLI for simplicity
