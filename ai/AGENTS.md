# Agent Rules

Agents working in this project MUST follow these rules without exception:

## 0. Follow Coding Standards

- **MUST** read and follow specialized coding standards in `ai/rules/`:
  - `project-constants.md` - Core constants and standards (coverage, assertions, etc.)
  - `typescript-coding-standards.md` - TypeScript rules, imports, type safety
  - `testing-standards.md` - Test structure, coverage, single assertion rule
  - `code-quality-tools.md` - Knip, pre-commit hooks, security audits
  - `documentation-standards.md` - TSDoc, README, changelog requirements
  - `performance-standards.md` - CLI startup, memory, bundle size limits
- Standards are also available via symlinks: `.agent/rules/`, `.antigravity/rules/`, `.windsurf/rules/`
- Complete guidelines available in `CODING_GUIDELINES.md`

## 1. No Skipping Pre-commit Hooks

- **MUST NOT** use `--no-verify` flag with git commit commands
- All commits must pass pre-commit hooks
- Hooks enforce code quality standards

## 2. No Skipping Tests

- **MUST** run full test suite before committing
- All code changes require corresponding test coverage
- Tests must pass with 85%+ coverage minimum

## 3. No Skipping Coverage Checks

- **MUST** ensure coverage meets 85% baseline threshold
- Run `npm run coverage:check` to verify baseline
- Run `npm run coverage:save` to update baseline after improvements
- Coverage cannot be lowered below 85% under any circumstances

## 4. No Skipping Linting

- **MUST** run all linting checks before committing:
  - ESLint for JavaScript/TypeScript
  - Prettier for code formatting
  - markdownlint for Markdown files
  - knip for unused dependencies
  - Security audit

## 5. Enforce Pre-commit Hooks

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
- ✓ Follow coding standards in `ai/rules/`
