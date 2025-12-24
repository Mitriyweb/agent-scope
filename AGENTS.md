<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Agent Rules

Agents working in this project MUST follow these rules without exception:

### 1. No Skipping Pre-commit Hooks

- **MUST NOT** use `--no-verify` flag with git commit commands
- All commits must pass pre-commit hooks
- Hooks enforce code quality standards

### 2. No Skipping Tests

- **MUST** run full test suite before committing
- All code changes require corresponding test coverage
- Tests must pass with 85%+ coverage minimum

### 3. No Skipping Coverage Checks

- **MUST** ensure coverage meets 85% baseline threshold
- Run `npm run coverage:check` to verify baseline
- Run `npm run coverage:save` to update baseline after improvements
- Coverage cannot be lowered below 85% under any circumstances

### 4. No Skipping Linting

- **MUST** run all linting checks before committing:
  - ESLint for JavaScript/TypeScript
  - Prettier for code formatting
  - markdownlint for Markdown files
  - knip for unused dependencies
  - Security audit

### 5. Enforce Pre-commit Hooks

- All hooks have `always_run: true` in `.pre-commit-config.yaml`
- Hooks cannot be bypassed or skipped
- Commits fail if any check fails (prevents regressions)

## Commit Checklist

Before committing, verify:

- ✓ All tests pass: `npm test`
- ✓ Coverage meets 85%: `npm run coverage:check`
- ✓ Code formatted: `npm run format`
- ✓ Linting passes: `npm run lint`
- ✓ No unused dependencies: `npm run knip`
- ✓ Security audit passes: `npm audit`
- ✓ No `--no-verify` flag used in commit command
