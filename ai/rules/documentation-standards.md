# Documentation Standards

## TSDoc Comments

### ⚠️ CRITICAL: All public functions MUST have TSDoc comments

````typescript
/**
 * Parses configuration file and validates its structure
 * @param configPath - Path to the configuration file
 * @param options - Optional parsing configuration
 * @returns Parsed and validated configuration object
 * @throws {ConfigError} When configuration is invalid or file cannot be read
 * @example
 * ```typescript
 * const config = parseConfig('./config.yml', { strict: true });
 * console.log(config.version);
 * ```
 */
function parseConfig(configPath: string, options?: ParseOptions): Config {
  // implementation
}
````

### Required TSDoc Tags

- `@param` - For each parameter with description
- `@returns` - For return value description
- `@throws` - For each possible exception type
- `@example` - At least one usage example for complex functions
- `@deprecated` - For deprecated functions with migration path

### TSDoc Best Practices

- Use clear, concise descriptions
- Include type information even when TypeScript provides it
- Provide realistic examples
- Document edge cases and limitations
- Link to related functions with `{@link FunctionName}`

---

## README Standards

### ⚠️ CRITICAL: README files MUST be updated with new features

### Required Sections

```markdown
# Project Name

Brief description of what the project does.

## Installation

\`\`\`bash
npm install --save-exact package-name
\`\`\`

## Usage

### Basic Usage

\`\`\`typescript
// Example code
\`\`\`

### Advanced Usage

\`\`\`typescript
// More complex examples
\`\`\`

## API Reference

### Functions

- `functionName(param)` - Description

### Types

- `TypeName` - Description

## Development

\`\`\`bash
npm run build
npm run test:coverage
npm run lint
\`\`\`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
```

### README Update Rules

- **New features**: Add to Usage section with examples
- **Breaking changes**: Update examples and add migration notes
- **New APIs**: Document in API Reference section
- **Configuration changes**: Update relevant sections

---

## Changelog Standards

### ⚠️ CRITICAL: API changes MUST be documented in CHANGELOG.md

### Format (Keep a Changelog)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New feature descriptions

### Changed

- Changes in existing functionality

### Deprecated

- Soon-to-be removed features

### Removed

- Now removed features

### Fixed

- Bug fixes

### Security

- Vulnerability fixes

## [1.0.0] - 2024-01-01

### Added

- Initial release
```

### Changelog Rules

- **Breaking changes**: Always document in `### Changed` or `### Removed`
- **New features**: Document in `### Added` with usage examples
- **Bug fixes**: Document in `### Fixed` with issue references
- **Security**: Always document security fixes separately
- **Links**: Include links to issues/PRs when relevant

---

## Code Comments Standards

### When to Comment

```typescript
// ✅ Good - Explain WHY, not WHAT
// Using exponential backoff to handle rate limiting from external API
const delay = Math.pow(2, attempt) * 1000;

// ✅ Good - Complex business logic
// Calculate tax based on jurisdiction rules:
// - EU: VAT applies to digital services
// - US: Sales tax varies by state
// - Others: No tax for digital services
const tax = calculateTax(amount, userLocation, productType);

// ❌ Bad - Obvious what the code does
// Increment counter by 1
counter++;

// ❌ Bad - Outdated comment
// TODO: Remove this when API v2 is ready (written in 2020, now 2024)
```

### Comment Types

- **Why comments**: Explain business logic and decisions
- **Warning comments**: Alert about gotchas or limitations
- **TODO comments**: Include date and context
- **FIXME comments**: Include issue number if applicable
- **Performance comments**: Explain optimization rationale

---

## Inline Documentation

### Type Definitions

```typescript
/**
 * Configuration options for the CLI application
 */
interface CliOptions {
  /** Path to configuration file (default: './config.yml') */
  configPath?: string;

  /** Enable verbose logging output */
  verbose?: boolean;

  /**
   * Output format for results
   * @default 'json'
   */
  format?: 'json' | 'yaml' | 'table';
}
```

### Enum Documentation

```typescript
/**
 * Available command types for the CLI
 */
enum CommandType {
  /** Build the project and generate artifacts */
  Build = 'build',

  /** Deploy to specified environment */
  Deploy = 'deploy',

  /** Run test suite with coverage */
  Test = 'test',
}
```

---

## Documentation Maintenance

### Update Triggers

- **New public API**: Add TSDoc and README examples
- **Breaking changes**: Update all affected documentation
- **Bug fixes**: Update examples if they were incorrect
- **Performance improvements**: Update performance claims
- **Security fixes**: Update security-related documentation

### Review Checklist

- [ ] All public functions have TSDoc comments
- [ ] README examples are tested and working
- [ ] CHANGELOG entries are complete and accurate
- [ ] Code comments explain WHY, not WHAT
- [ ] No outdated TODO/FIXME comments
- [ ] Type definitions are documented
- [ ] Breaking changes are clearly marked
