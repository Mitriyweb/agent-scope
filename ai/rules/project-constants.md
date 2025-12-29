# Project Constants

This file defines key constants and standards used across all project rules.

## Test Coverage Standards

### ⚠️ CRITICAL: 85% Minimum Coverage

- **Minimum threshold**: 85% for all metrics (lines, functions, branches, statements)
- **Non-negotiable**: Coverage cannot be lowered below 85% under any circumstances
- **Baseline file**: `coverage-baseline.json`
- **Check command**: `npm run coverage:check`
- **Save command**: `npm run coverage:save`

## Test Structure Standards

### ⚠️ CRITICAL: Single Assertion Rule

- **Rule**: Each `it(...)` block MUST contain exactly ONE primary assertion (`expect`)
- **Rationale**: One test = one behavior being tested
- **Exception**: Multiple related assertions on same object for single logical behavior
- **Benefit**: Focused, readable, and maintainable tests

## TypeScript Standards

### ⚠️ CRITICAL: Zero Tolerance for `any`

- **Rule**: NEVER use `any` type
- **Enforcement**: ESLint will enforce this with error
- **Alternative**: Use explicit types or generics instead
- **Exception**: None - no exceptions allowed

## Dependency Management Standards

### ⚠️ CRITICAL: Exact Versions Only

- **Rule**: NEVER use semver ranges (`^` or `~`) in package.json
- **Format**: `"package": "1.2.3"` not `"package": "^1.2.3"`
- **Rationale**: Ensures reproducible builds and prevents unexpected breaking changes
- **Check**: `grep -E '"\^|"~' package.json` should return empty

## Import Standards

### ⚠️ CRITICAL: Absolute Imports Only

- **Rule**: NEVER use relative imports
- **Format**: `import { Config } from '@/types/config'`
- **Forbidden**: `import { Config } from '../types/config'`
- **Enforcement**: ESLint will enforce this

## Pre-commit Standards

### ⚠️ CRITICAL: No Bypassing Hooks

- **Rule**: NEVER use `--no-verify` flag with git commit
- **Enforcement**: All hooks have `always_run: true`
- **Failure**: Commit fails if any check fails (prevents regressions)
- **Coverage**: Hooks automatically check and update coverage baseline

## File Organization Standards

### Directory Structure

```text
src/                  # Source code
├── commands/         # CLI command implementations
├── types/           # TypeScript type definitions
├── enums/           # Enum definitions
├── utils/           # Utility functions
└── index.ts         # Entry point

tests/               # Test files (mirrors src/ structure)
├── commands/
├── types/
├── utils/
└── test-utils/      # Shared test utilities
```

### Naming Conventions

- **Files**: kebab-case (`config-parser.ts`)
- **Directories**: kebab-case (`command-handlers/`)
- **Classes**: PascalCase (`ConfigParser`)
- **Functions**: camelCase (`parseConfig`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_CONFIG_PATH`)
- **Interfaces**: PascalCase (`ConfigOptions`)
- **Enums**: PascalCase (`CommandType`)
- **Enum values**: PascalCase (`CommandType.BuildProject`)

## Quality Check Commands

### Standard Command Sequence

```bash
# Full quality check (run before commit)
npm run build
npm run test:coverage
npm run lint
npm run knip
npm audit --audit-level=moderate
```

### Individual Commands

```bash
npm run format        # Prettier formatting
npm run lint:md      # Markdown linting
npm run lint:js      # ESLint for TypeScript
npm run coverage:check # Verify coverage baseline
npm run coverage:save  # Update coverage baseline
```
