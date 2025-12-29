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

For detailed agent rules and coding standards, see: **`ai/AGENTS.md`**

### Quick Summary

- **Follow coding standards** in `ai/rules/` (TypeScript, testing, quality tools)
- **Never skip pre-commit hooks** - no `--no-verify` flag
- **85% test coverage minimum** - non-negotiable baseline
- **Run full quality checks** before committing
- **All commits must pass** build, tests, linting, security audit
