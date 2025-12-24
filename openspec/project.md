# Project Context

## Purpose

This workspace demonstrates and documents **OpenSpec** methodology for spec-driven development with structured change proposals, validation, and archival workflows.

Goals:

- Maintain specifications as single source of truth
- Track all changes through explicit proposals
- Enable AI-assisted development with strict structure
- Ensure reproducibility and auditability of all modifications

## Tech Stack

- **OpenSpec CLI** — specification validation and management
- **Markdown** — documentation and specs format
- **Git** — version control for specs and changes

## Project Conventions

### Code Style

- Use Markdown for all documentation
- Follow kebab-case for change IDs: `add-feature-name`
- Use verb-led prefixes: `add-`, `update-`, `remove-`, `refactor-`
- Keep files under 500 lines for readability

### Dependency Management

- **NEVER use semver ranges** (`^` or `~`) in package.json dependencies
- Always pin exact versions: `"eslint": "9.17.0"` not `"eslint": "^9.17.0"`
- This ensures reproducible builds and prevents unexpected breaking changes
- When updating dependencies, explicitly specify the exact new version

### Architecture Patterns

- **Single source of truth**: `specs/` contains current state
- **Delta-based changes**: proposals in `changes/` use ADDED/MODIFIED/REMOVED
- **Explicit validation**: all changes must pass `openspec validate --strict`
- **Archive after deployment**: completed changes move to `changes/archive/`

### Testing Strategy

- Validate all proposals before implementation
- Use `openspec validate --strict` for comprehensive checks
- Verify scenario format: `#### Scenario:` (4 hashtags)
- Ensure every requirement has at least one scenario

### Git Workflow

- Create change proposals in feature branches
- Run validation before committing
- Reference change IDs in commit messages
- Separate PRs for proposal creation and implementation
- Archive changes in separate PR after deployment

## Domain Context

OpenSpec is a **specification-driven development methodology** that:

- Defines requirements with SHALL/MUST statements
- Uses scenarios with WHEN/THEN structure for acceptance criteria
- Tracks changes through structured proposals
- Validates consistency between specs and deltas
- Archives completed changes with timestamps

Key concepts:

- **Capability**: A single focused feature area (e.g., `auth`, `payments`)
- **Requirement**: A normative statement about system behavior
- **Scenario**: Concrete test case with conditions and expected outcomes
- **Delta**: ADDED/MODIFIED/REMOVED changes to requirements
- **Change ID**: Unique identifier for a proposal

## Important Constraints

- Every requirement MUST have at least one scenario
- Scenarios MUST use `#### Scenario:` format (4 hashtags)
- Use SHALL/MUST for normative requirements (not should/may)
- MODIFIED requirements must include full updated text
- Change IDs must be unique across all active and archived changes
- Archive only after deployment is complete

## External Dependencies

- **OpenSpec CLI** (`openspec` command) — required for validation and management
- **ripgrep** (`rg`) — optional for full-text search
- **jq** — optional for JSON parsing in scripts

No external services or APIs required.
