# Phase 0 — Project Bootstrap Design

## Context

The agent-scope project is a new CLI tool for configuring and orchestrating AI agents with explicit roles, scoped context, and OpenSpec-compatible specifications. Phase 0 establishes the foundational repository structure, tooling, and documentation needed for all subsequent development phases.

This is a greenfield project with no existing implementation. The design focuses on establishing clear conventions and minimal viable structure that supports the project's core principles: explicit behavior, versioned configuration, and OpenSpec integration.

## Goals / Non-Goals

### Goals

- Establish a clean, scalable repository structure
- Create a functional CLI entry point with basic command routing
- Document project purpose, roadmap, and contribution guidelines
- Set up governance and security documentation
- Enable seamless integration with OpenSpec tooling
- Provide clear development workflow for future phases

### Non-Goals

- Implement core agent functionality (Phase 1)
- Create role definitions or agent registry (Phase 1)
- Build specification validation (Phase 2)
- Implement agent flows or execution (Phase 3+)

## Decisions

### Directory Structure

**Decision**: Use standard Node.js project layout with clear separation of concerns.

```bash
agent-scope/
├── bin/                    # CLI entry point
├── src/                    # Source code (empty in Phase 0)
├── tests/                  # Test files (empty in Phase 0)
├── docs/                   # Additional documentation
├── openspec/               # Specification and change tracking
├── package.json            # Project metadata and dependencies
├── README.md               # Project overview
├── ROADMAP.md              # Phase-based development plan
├── CONTRIBUTING.md         # Development guidelines
├── CHANGELOG.md            # Version history
├── LICENSE                 # MIT license
├── CODE_OF_CONDUCT.md      # Community guidelines
├── SECURITY.md             # Security reporting
└── .gitignore              # Git exclusions
```

**Rationale**: This structure is familiar to Node.js developers, scales well as the project grows, and clearly separates CLI tooling, implementation, tests, and documentation.

### CLI Entry Point

**Decision**: Create `bin/agent-scope` as a Node.js executable script with basic command routing.

**Rationale**:

- Allows `npm install -g` to make the tool globally available
- Provides a clear entry point for all subcommands
- Enables future expansion to multiple commands without refactoring

### Documentation Strategy

**Decision**: Maintain separate, focused documents for different audiences:

- `README.md` — Project overview and quick start
- `ROADMAP.md` — Phase-based development plan (actionable checklist)
- `CONTRIBUTING.md` — Developer workflow and conventions
- `CHANGELOG.md` — Version history and breaking changes
- `CODE_OF_CONDUCT.md` — Community standards
- `SECURITY.md` — Vulnerability reporting

**Rationale**: Clear separation of concerns makes documentation easier to maintain and helps different stakeholders find relevant information quickly.

### OpenSpec Integration

**Decision**: Use OpenSpec for all specification and change tracking from Phase 0 onward.

**Rationale**:

- Aligns with project's commitment to explicit, versioned specifications
- Enables AI-assisted development with structured proposals
- Provides audit trail of all changes and decisions
- Validates consistency between specifications and implementation

## Risks / Trade-offs

### Risk: Over-engineering early structure

**Mitigation**: Keep Phase 0 minimal. Only create directories and files needed for immediate development. Avoid premature abstraction or complex tooling setup.

### Risk: Documentation drift

**Mitigation**: Enforce documentation updates as part of the development workflow. Use linters (markdownlint) to catch formatting issues. Include documentation review in PR process.

### Risk: CLI design locks in patterns

**Mitigation**: Design CLI routing to be flexible. Use subcommand pattern that allows easy addition of new commands without refactoring core routing logic.

## Migration Plan

Phase 0 is the initial setup, so there is no migration from a previous state. However, subsequent phases depend on Phase 0 completion:

1. **Phase 1** depends on: Repository structure, CLI entry point, and development workflow
2. **Phase 2** depends on: OpenSpec integration and validation tooling
3. **Phase 3+** depend on: All previous phases

## Open Questions

- Should `bin/agent-scope` be written in JavaScript or TypeScript? (Recommend JavaScript for Phase 0 simplicity)
- What Node.js version should be the minimum? (Current `.nvmrc` specifies v20.9.0)
- Should we add a `Makefile` for common development tasks? (Defer to Phase 1 if needed)
- Should we set up CI/CD in Phase 0? (Recommend deferring to Phase 1 or later)
