# Code Quality Tools

## Knip - Unused Code Detection

**Knip** finds unused files, dependencies, and exports in the codebase.

### Running Knip

```bash
# Check for all unused code
npm run knip
```

### When to Run Knip

- **Pre-commit (automatic)** - Knip runs automatically on every commit
- **During refactoring** - Identify code that can be safely removed
- **Before releases** - Clean up unused dependencies
- **Monthly maintenance** - Regular cleanup to prevent accumulation

### What Knip Detects

1. **Unused files** - TypeScript files not imported anywhere
2. **Unused dependencies** - Packages in `package.json` not used in code
3. **Unused exports** - Functions/classes exported but never imported
4. **Unused types** - TypeScript interfaces not referenced
5. **Duplicate exports** - Same export from multiple entry points

### Handling False Positives

Knip may report false positives for:

- **Test utilities** - Used in tests but not detected
- **Config files** - Used by build tools
- **Dynamic imports** - Runtime imports not statically analyzed
- **Type-only imports** - TypeScript types used only in type annotations

Add exceptions to `knip.json`:

```json
{
  "ignoreDependencies": ["tsconfig-paths"],
  "ignore": ["src/types/global.d.ts"]
}
```

### Best Practices

1. **Review before removing** - Always verify Knip findings before deleting code
2. **Check git history** - Ensure code isn't used in other branches
3. **Run tests** - Verify nothing breaks after cleanup
4. **Incremental cleanup** - Remove unused code in small batches
5. **Document exceptions** - Add comments explaining why code is kept despite Knip warnings

---

## Pre-commit Requirements

### ⚠️ CRITICAL: All checks must pass

The following checks run automatically on every commit and **CANNOT be bypassed**:

1. **Build** - TypeScript compilation must succeed
2. **Format** - Prettier formatting must pass
3. **Lint Markdown** - All markdown files must be valid
4. **Lint JavaScript/TypeScript** - ESLint must pass
5. **Knip** - No unused dependencies/exports
6. **Security Audit** - No high-severity vulnerabilities
7. **Test Coverage** - All tests must pass with 85%+ coverage
8. **Coverage Baseline** - Coverage cannot decrease below baseline

### Pre-commit checklist

Before committing, verify:

- ✓ `npm run build` - TypeScript compiles without errors
- ✓ `npm run test:coverage` - All tests pass with 85%+ coverage
- ✓ `npm run lint` - All linting passes
- ✓ `npm run knip` - No unused code detected
- ✓ `npm audit --audit-level=moderate` - No security issues
- ✓ **NEVER use `--no-verify`** flag with git commit

### Quality check commands

```bash
# Full quality check sequence
npm run build
npm run test:coverage
npm run lint
npm run knip
npm audit --audit-level=moderate

# Individual checks
npm run format        # Prettier formatting
npm run lint:md      # Markdown linting
npm run lint:js      # ESLint for TypeScript
```

---

## File and Directory Structure

### Source organization

```text
src/
├── app/          # Main application code
│   ├── commands/ # CLI command implementations
│   ├── types/    # TypeScript type definitions
│   ├── utils/    # Utility functions
│   └── index.ts  # Main entry point
└── tests/        # Test files (mirrors src/app structure)
    ├── commands/
    ├── utils/
    └── test-utils/
```

### Directory naming

- **Files**: kebab-case (`config-parser.ts`)
- **Directories**: kebab-case (`command-handlers/`)
- Keep files under 500 lines for readability
- Separate concerns into focused modules

---

## Security Audit

### Vulnerability checking

```bash
# Check for vulnerabilities
npm audit --audit-level=moderate

# After package installation
grep -E '"\^|"~' package.json  # Should return empty
```

### Security requirements

- No high-severity vulnerabilities allowed
- All dependencies must use exact versions
- Regular security audits as part of maintenance
