# Testing Standards

## Test Structure Requirements

### Test location and naming

- Place all test files under `tests/` directory
- Test path MUST mirror the source file path under `src/`
- Example: `src/utils/formatting.ts` → `tests/utils/formatting.test.ts`
- Use `.test.ts` suffix for all test files
- Shared test utilities live under `tests/test-utils/`

### Test organization

- Use `describe(...)` blocks to group related tests
- Prefer `beforeEach` to reset state/mocks between tests
- **Each `it(...)` block MUST contain exactly one `expect(...)` statement**

---

## ⚠️ CRITICAL: Single Assertion Rule

**Each test MUST have exactly ONE primary assertion.**

```typescript
// ❌ Wrong (Multiple Assertions)
it('validates command arguments correctly', () => {
  expect(validateArgs(['--input', 'file.txt'])).toBe(true);
  expect(validateArgs(['--output'])).toBe(false);
  expect(validateArgs([])).toBe(false);
});

// ✅ Correct (Single Assertion Per Test)
it('validates valid command arguments', () => {
  expect(validateArgs(['--input', 'file.txt'])).toBe(true);
});

it('rejects incomplete command arguments', () => {
  expect(validateArgs(['--output'])).toBe(false);
});

it('rejects empty command arguments', () => {
  expect(validateArgs([])).toBe(false);
});
```

### Exception: Related assertions on same object

Multiple related assertions on the same object are acceptable if they test a single logical behavior:

```typescript
// ✅ Acceptable - testing single behavior (object creation)
it('creates user with correct properties', () => {
  const user = createUser('john@example.com');
  expect(user.email).toBe('john@example.com');
  expect(user.isActive).toBe(true);
  expect(user.role).toBe('user');
});
```

---

## CLI Testing Patterns

For CLI applications, test these specific patterns:

```typescript
// Test command parsing
it('parses build command correctly', () => {
  const result = parseCommand(['build', '--config', 'test.yml']);
  expect(result.command).toBe('build');
});

// Test file operations
it('reads configuration file successfully', () => {
  const config = readConfig('test-config.yml');
  expect(config.version).toBe('1.0.0');
});

// Test error handling
it('throws error for invalid configuration', () => {
  expect(() => readConfig('invalid.yml')).toThrow('Invalid configuration');
});
```

---

## Test Isolation Requirements

- Tests MUST NOT depend on external files or network
- Mock file system operations using Jest mocks
- Reset mocks between tests
- Tests MUST be deterministic
- No dependencies on wall-clock time, network availability, or local machine state

---

## Type Safety in Tests

- Use proper TypeScript types in tests
- Avoid `any` in test code
- Type test data properly

```typescript
// ✅ Correct - typed test data
interface TestConfig {
  name: string;
  version: string;
}

const mockConfig: TestConfig = {
  name: 'test-project',
  version: '1.0.0',
};
```

---

## Coverage Requirements

### ⚠️ CRITICAL: 85% minimum coverage

> **Reference**: See `project-constants.md` for detailed coverage standards.

- **Minimum 85% coverage** for all metrics (lines, functions, branches, statements)
- Coverage is computed via `npm run test:coverage`
- CI and pre-commit MUST fail if coverage decreases below 85%
- Coverage cannot be lowered below 85% under any circumstances

### Coverage commands

```bash
# Run tests with coverage
npm run test:coverage

# Check if coverage meets baseline
npm run coverage:check

# Save new coverage baseline (after improvements)
npm run coverage:save
```

### Coverage baseline management

- Baseline stored in `coverage-baseline.json`
- Pre-commit hook automatically checks coverage
- Commit fails if coverage drops below 85% (prevents regressions)
- If coverage improves, baseline is updated and staged automatically

---

## Test Development Rules

### Test-Driven Development

- All code MUST be written with tests from the start
- Write tests BEFORE or ALONGSIDE implementation, never after
- Every function, class, and module requires corresponding test coverage
- Task is only complete when both implementation AND tests are done

### Test Structure Rule: 1 it, 1 expect

- Each test (`it` block) MUST have exactly ONE primary assertion (`expect`)
- One test = one behavior being tested
- Use separate `it` blocks for separate concerns or conditions
- This ensures tests are focused, readable, and maintainable

---

## Mock Guidelines

- Mock external dependencies
- Tests MUST NOT perform real network calls
- Use Jest mocks for file system operations
- Reset mocks/timers between tests
- Avoid shared mutable state between tests

---

## Assertion Best Practices

- Prefer specific assertions (avoid `toBeTruthy` when a more explicit assertion is possible)
- Use `toHaveBeenCalled()` / `toHaveBeenCalledWith()` for function call verification
- Use `toThrow()` / `rejects.toThrow()` for error cases
- For async operations, prefer `findBy*` and `waitFor`

---

## Performance Guidelines

- Keep tests fast and focused
- Mock expensive operations
- Avoid unnecessary rerenders
- Tests should complete quickly to maintain developer productivity
