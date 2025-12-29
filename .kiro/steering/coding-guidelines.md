---
inclusion: always
---

# Coding Guidelines Reference

This file automatically includes coding guidelines for all agent interactions.

## Specialized Guidelines

- **Project Constants**: See `ai/rules/project-constants.md`
- **TypeScript Coding**: See `ai/rules/typescript-coding-standards.md`
- **Testing Standards**: See `ai/rules/testing-standards.md`
- **Code Quality Tools**: See `ai/rules/code-quality-tools.md`
- **Documentation Standards**: See `ai/rules/documentation-standards.md`
- **Performance Standards**: See `ai/rules/performance-standards.md`
- **Complete Guidelines**: See `CODING_GUIDELINES.md`

## Key Rules Summary

### TypeScript

- **No `any` types** - Use explicit TypeScript types
- **Exact versions only** - No `^` or `~` in package.json
- **Absolute imports** - Use `@/` prefix, no relative imports
- **Enums for fixed sets** - Never use union types for known values

### Testing

- **85% test coverage minimum** - Non-negotiable baseline
- **Single assertion per test** - One `expect()` per `it()` block
- **Test isolation** - No external dependencies or network calls
- **Type safety in tests** - No `any` types in test code

### Quality

- **Pre-commit hooks** - Never use `--no-verify`
- **Knip for unused code** - Run regularly to clean up
- **Security audits** - No high-severity vulnerabilities

### Documentation

- **TSDoc comments** - All public functions must be documented
- **README updates** - New features must update documentation
- **Changelog entries** - API changes must be documented

### Performance

- **CLI startup** - Commands must start within 100ms
- **Memory usage** - Must not exceed 50MB for typical operations
- **Bundle size** - Must be tracked and optimized

## Quick Commands

```bash
# Quality checks
npm run build
npm run test:coverage
npm run lint
npm run knip

# Coverage management
npm run coverage:check
npm run coverage:save
```
