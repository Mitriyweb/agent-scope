# Project Context

## Purpose

This workspace demonstrates and documents **OpenSpec** methodology for spec-driven development with structured change proposals, validation, and archival workflows.

Goals:

- Maintain specifications as single source of truth
- Track all changes through explicit proposals
- Enable AI-assisted development with strict structure
- Ensure reproducibility and auditability of all modifications

## Tech Stack

- **TypeScript** — strict typing, no `any` allowed
- **Node.js** — runtime (v20.9.0+)
- **OpenSpec CLI** — specification validation and management
- **Markdown** — documentation and specs format
- **Git** — version control for specs and changes

## Project Conventions

### Code Style

#### TypeScript Requirements

- **Language**: TypeScript only, no JavaScript files in `src/`
- **Strict Mode**: Enable all strict compiler options in `tsconfig.json`
- **No `any`**: Forbidden. Use explicit types or generics instead
- **Enums**: Always use `enum` instead of union types for ANY fixed set of values
  - ✓ `enum Status { Active = 'active', Inactive = 'inactive' }`
  - ✗ `type Status = 'active' | 'inactive'`
  - ✓ `command: CommandType` (when command is limited to known values)
  - ✗ `command: string | null` (never use unions for limited value sets)
- **Naming**: Use PascalCase for types, interfaces, enums; camelCase for variables/functions
- **Import Paths**: Always use absolute paths from project root
  - ✓ `import { CommandType } from '@/enums/CommandType'`
  - ✗ `import { CommandType } from '../enums/CommandType'`
- **Type Imports**: Use `import type` for type-only imports
  - ✓ `import type { CliOptions } from '@/types/index'`
  - ✗ `import { CliOptions } from '@/types/index'` (when used only as type)
- **Source Organization**: All source code in `src/` directory
  - `src/types/` — Type definitions and interfaces
  - `src/enums/` — Enum definitions
  - `src/commands/` — CLI command implementations
  - `src/utils/` — Utility functions
  - `src/index.ts` — Entry point

#### General Style

- Use Markdown for all documentation
- Follow kebab-case for change IDs: `add-feature-name`
- Use verb-led prefixes: `add-`, `update-`, `remove-`, `refactor-`
- Keep files under 500 lines for readability
- **Tests are mandatory**: No code without tests
- Test files must be comprehensive and cover all code paths
- Use descriptive test names that explain what is being tested

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

- **Test-Driven Development**: All code MUST be written with tests from the start
- Write tests BEFORE or ALONGSIDE implementation, never after
- Every function, class, and module requires corresponding test coverage
- Use Jest for unit testing with TypeScript support
- **Test Directory Structure**: Tests live in `/tests` directory mirroring `/src` structure
  - Example: `src/commands/HelpCommand.ts` → `tests/commands/HelpCommand.spec.ts`
  - Test file naming: `<name>.spec.ts`
  - Directory hierarchy must match source code organization
  - Never colocate tests with source files
- **Test Structure Rule: 1 it, 1 expect**
  - Each test (`it` block) MUST have exactly ONE primary assertion (`expect`)
  - One test = one behavior being tested
  - Multiple related assertions on same object are acceptable (e.g., `expect(obj.prop1).toBe(x); expect(obj.prop2).toBe(y)` for same behavior)
  - Use separate `it` blocks for separate concerns or conditions
  - This ensures tests are focused, readable, and maintainable
- **Minimum coverage: 85% for all code** (increased from 80%)
  - This is a hard floor that cannot be lowered
  - All new code must be written with tests to achieve 85%+ coverage
  - Existing code must maintain or improve coverage toward 85%
- **Coverage Reporting**: Test coverage must be tracked and reported
  - Run `npm run test:coverage` to generate coverage reports
  - Coverage reports generated in `coverage/` directory
  - Coverage thresholds enforced: 85% branches, functions, lines, statements
  - CI pipeline runs coverage checks on every push/PR
  - Coverage reports available in HTML format: `coverage/lcov-report/index.html`
- **Coverage Baseline**: Coverage must never decrease below 85%
  - **MINIMUM THRESHOLD: 85% coverage is non-negotiable**
  - Coverage cannot be lowered below 85% under any circumstances
  - All metrics (statements, branches, functions, lines) must maintain 85% minimum
  - Baseline stored in `coverage-baseline.json`
  - Run `npm run coverage:check` to verify coverage meets baseline
  - Run `npm run coverage:save` to update baseline after improvements
  - Pre-commit hook automatically checks coverage and updates baseline if improved
  - Commit fails if coverage drops below 85% (prevents regressions)
  - Baseline is committed to git to track coverage history
  - Auto-update on commit: if coverage improves, baseline is updated and staged
  - If coverage falls below 85%, must add tests to restore coverage before committing
- **Tests in Tasks**: Every task in `tasks.md` MUST include test implementation as a sub-task
  - Example: `1.1 Implement feature X` should have `1.1.1 Write tests for feature X`
  - Tests are not optional add-ons, they are part of the task definition
  - Task is only complete when both implementation AND tests are done
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
