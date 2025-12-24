# Contributing to agent-scope

Thank you for your interest in contributing to agent-scope! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.

## Getting Started

### Prerequisites

- Node.js v20.9.0 or later (see `.nvmrc`)
- npm v10 or later
- Git

### Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mitriyweb/agent-scope.git
   cd agent-scope
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Verify the setup:

   ```bash
   npm run lint
   ./bin/agent-scope --version
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation
- `refactor/` for refactoring
- `test/` for test improvements

Example: `feature/add-agent-registry`

### Commit Messages

Write clear, descriptive commit messages:

- Use present tense: "Add feature" not "Added feature"
- Reference related issues: "Fix #123"
- Keep messages concise but informative

Example: `Add agent registry validation (fixes #45)`

### Pull Requests

1. Create a feature branch from `main`
2. Make focused, atomic commits
3. Write a clear PR description explaining the changes
4. Reference any related issues
5. Ensure all checks pass before requesting review

## Code Style

### Linting and Formatting

Run linters before committing:

```bash
npm run lint          # Run all linters
npm run format        # Auto-format code
npm run lint:md       # Check Markdown
npm run lint:js       # Check JavaScript
```

### JavaScript Style

- Use ES6+ syntax
- Follow ESLint configuration in `eslint.config.js`
- Prefer const/let over var
- Use meaningful variable names

### Markdown Style

- Follow markdownlint rules in `.markdownlint-cli2.jsonc`
- Use proper heading hierarchy
- Include code blocks with language specification
- Keep line length reasonable for readability

## Testing

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch   # Run tests in watch mode
```

### Writing Tests

- Write tests for new features
- Maintain or improve code coverage
- Use descriptive test names
- Test both success and failure cases

## Documentation

### Updating Documentation

- Keep README.md up to date with project changes
- Update CHANGELOG.md for user-facing changes
- Document new features in relevant docs
- Use clear, concise language

### Documentation Standards

- Use Markdown for all documentation
- Include code examples where helpful
- Keep documentation DRY (Don't Repeat Yourself)
- Link to related documentation

## OpenSpec Workflow

This project uses OpenSpec for specification-driven development:

1. For new features or breaking changes, create a proposal in `openspec/changes/`
2. Follow the proposal structure: `proposal.md`, `tasks.md`, `design.md` (if needed), and spec deltas
3. Validate proposals with `openspec validate --strict`
4. Reference the change ID in related PRs and commits

See `openspec/AGENTS.md` for detailed OpenSpec instructions.

## Reporting Issues

### Security Issues

Please report security vulnerabilities responsibly. See [SECURITY.md](SECURITY.md) for details.

### Bug Reports

When reporting bugs, include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, OS, etc.)
- Relevant logs or error messages

### Feature Requests

When requesting features:

- Describe the use case
- Explain the expected behavior
- Provide examples if helpful
- Consider if this aligns with project goals

## Review Process

### Code Review

- Reviews are collaborative and constructive
- Address feedback respectfully
- Ask questions if feedback is unclear
- Approve once satisfied with changes

### Merge Criteria

- All CI checks pass
- At least one approval from maintainers
- Documentation is updated
- CHANGELOG.md is updated (for user-facing changes)

## Questions?

- Check existing issues and discussions
- Review project documentation
- Ask in pull request comments
- Open a discussion for broader topics

Thank you for contributing!
