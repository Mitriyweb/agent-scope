# TypeScript Coding Standards

## Dependency Management

### ⚠️ CRITICAL: Use exact versions only

> **Reference**: See `project-constants.md` for detailed dependency management standards.

**NEVER use semver ranges (^ or ~) in package.json dependencies.**

```json
// ❌ Wrong - allows automatic updates
"dependencies": {
  "commander": "^14.0.2",
  "js-yaml": "^4.1.1"
}

// ✅ Correct - exact versions only
"dependencies": {
  "commander": "14.0.2",
  "js-yaml": "4.1.1"
}
```

### Installation commands

```bash
# Use --save-exact flag
npm install --save-exact package-name

# Or configure npm globally
npm config set save-exact true
```

---

## TypeScript Configuration

### ⚠️ CRITICAL: Strict TypeScript enforcement

Zero tolerance for `any` types:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true
}
```

### Language Requirements

- **TypeScript only** - No JavaScript files in `src/`
- **No `any` allowed** - Use explicit types or generics instead
- **Enums for fixed value sets** - Always use `enum` instead of union types:

```typescript
// ✅ Correct - use enums for fixed sets
enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

// ❌ Wrong - don't use union types for fixed sets
type Status = 'active' | 'inactive';
```

---

## Import Rules

### ⚠️ CRITICAL: Use absolute imports only

**NEVER use relative imports** - ESLint will enforce this:

```typescript
// ❌ Wrong - relative imports
import { Config } from '../../../types/config';
import { validateInput } from '../../utils/validation';

// ✅ Correct - absolute imports
import type { Config } from '@/types/config';
import { validateInput } from '@/utils/validation';
import { CommandType } from '@/enums/CommandType';
```

### Import organization

Group imports in this order:

1. Node.js built-ins
2. External packages
3. Internal modules (with `@/` prefix)

```typescript
// ✅ Correct import order
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { Command } from 'commander';
import * as yaml from 'js-yaml';

import type { Config } from '@/types/config';
import { validateInput } from '@/utils/validation';
```

---

## Naming Conventions

- **Files**: kebab-case (`config-parser.ts`)
- **Directories**: kebab-case (`command-handlers/`)
- **Classes**: PascalCase (`ConfigParser`)
- **Functions**: camelCase (`parseConfig`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_CONFIG_PATH`)
- **Interfaces**: PascalCase (`ConfigOptions`)
- **Enums**: PascalCase (`CommandType`)
- **Enum values**: PascalCase (`CommandType.BuildProject`)

---

## Type Safety Rules

- **NEVER use `any`** - ESLint will enforce this with error
- Use proper TypeScript types for all function parameters and return values
- Prefer interfaces over type aliases for object shapes
- Use `import type` for type-only imports
- Always use enums for any fixed set of values

```typescript
// ❌ Wrong
function processData(data: any): any {
  return data.map((item: any) => item.value);
}

// ✅ Correct
interface DataItem {
  value: string;
  id: number;
}

function processData(data: DataItem[]): string[] {
  return data.map((item: DataItem) => item.value);
}
```

---

## Error Handling

### CLI Error Patterns

```typescript
// ✅ Correct - structured error handling
class ConfigError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ConfigError';
  }
}

function readConfig(path: string): Config {
  try {
    const content = readFileSync(path, 'utf8');
    return yaml.load(content) as Config;
  } catch (error) {
    throw new ConfigError(`Failed to read config: ${error.message}`, 'CONFIG_READ_ERROR');
  }
}
```

### Exit codes for CLI

- `0` - Success
- `1` - General error
- `2` - Invalid usage/arguments
- `126` - Command not executable
- `127` - Command not found

---

## Module Organization

- Use named exports instead of default exports for better refactoring
- Keep modules focused on single responsibility
- Group imports: Node.js built-ins → external packages → internal modules

---

## Security Rules

- Validate all user inputs
- Sanitize file paths to prevent directory traversal
- Use secure defaults for file permissions
- Never execute user-provided code directly

```typescript
// ✅ Correct - input validation
function validateConfigPath(path: string): string {
  const resolved = resolve(path);
  if (!resolved.startsWith(process.cwd())) {
    throw new Error('Config path must be within current directory');
  }
  return resolved;
}
```

---

## Performance Guidelines

- Lazy load heavy dependencies
- Use streaming for large file operations
- Implement proper error boundaries
- Cache expensive computations
