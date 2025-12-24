# Design: Build System

## Context

The agent-scope project needs a build system to compile, validate, and package agents and flows for distribution. Currently, there's no mechanism to create production-ready artifacts. This design outlines the architecture for a modular, extensible build system.

## Goals / Non-Goals

**Goals:**

- Enable reproducible builds of agents and flows
- Support multiple output formats (JSON, archives)
- Provide build validation and verification
- Integrate with npm package distribution
- Support configuration-driven builds

**Non-Goals:**

- Docker/container support (future phase)
- CI/CD pipeline automation (separate concern)
- Performance optimization for large-scale builds (premature)
- Custom build plugins (v2 feature)

## Decisions

### 1. Build Configuration Format

**Decision:** Use `agent-scope.build.json` as the build configuration file.

**Rationale:**

- Consistent with project naming conventions
- JSON is widely supported and easy to parse
- Allows for schema validation
- Can be committed to version control

**Alternatives considered:**

- YAML: More human-readable but adds dependency
- JavaScript: Harder to validate and secure
- TOML: Less familiar to JavaScript developers

### 2. Build Artifact Structure

**Decision:** Store build artifacts in `dist/` directory with metadata.

**Rationale:**

- Follows Node.js convention
- Separates source from compiled output
- Easy to gitignore
- Supports multiple output formats

**Structure:**

```text
dist/
├── agents/
│   └── [agent-name].json
├── flows/
│   └── [flow-name].json
├── archives/
│   └── [project-name]-[version].tar.gz
└── metadata.json
```

### 3. Output Formats

**Decision:** Support JSON and tar.gz archive formats initially.

**Rationale:**

- JSON: Human-readable, easy to inspect, suitable for CI/CD
- tar.gz: Compact, preserves directory structure, suitable for distribution
- Both formats include metadata (version, timestamp, checksums)

### 4. Validation Strategy

**Decision:** Validate at multiple stages: configuration, compilation, and artifact.

**Rationale:**

- Early detection of issues
- Clear error messages at each stage
- Prevents invalid artifacts from being created

**Stages:**

1. Configuration validation (schema, required fields)
2. Compilation validation (syntax, references)
3. Artifact validation (integrity, completeness)

### 5. Command Architecture

**Decision:** Implement as separate `BuildCommand` and `ValidateCommand` classes.

**Rationale:**

- Single responsibility principle
- Reusable validation logic
- Clear separation of concerns
- Extensible for future commands

## Risks / Trade-offs

| Risk                           | Mitigation                                          |
| ------------------------------ | --------------------------------------------------- |
| Build configuration complexity | Start with minimal required fields; document well   |
| Large artifact sizes           | Implement compression; add size warnings            |
| Breaking changes in future     | Version the build configuration format              |
| Validation performance         | Cache validation results; optimize for common cases |

## Migration Plan

- **Phase 1 (Current):** Implement core build and validate commands
- **Phase 2:** Add npm package distribution support
- **Phase 3:** Add CI/CD integration examples
- **Phase 4:** Add Docker/container support

## Open Questions

1. Should build configuration support inheritance/extends?
2. Should we generate source maps for compiled artifacts?
3. Should we support incremental builds?
4. How should we handle build caching?

## Implementation Notes

- Use existing TypeScript compiler for validation
- Leverage existing Flow and Agent validators
- Implement builder pattern for artifact generation
- Add comprehensive error messages with suggestions
