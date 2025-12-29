# Backlog Usage Guide

This guide explains how to use the backlog tracking system in the **agent-scope** project.

## Overview

The backlog system provides:

- **Tactical planning**: Sprint-level tasks (1-4 weeks)
- **Roadmap integration**: Every item maps to strategic roadmap phases
- **OpenSpec integration**: Automatic change proposal generation
- **GitHub integration**: Sync with GitHub issues
- **Automation**: Workflows for creation, validation, and synchronization

## Quick Start

### Creating a New Backlog Item

#### Option 1: Interactive CLI

```bash
npm run backlog:create
```

#### Option 2: GitHub Actions UI

1. Go to **Actions** → **Create Backlog Item**
2. Click **Run workflow**
3. Fill in the form:
   - **Title**: Clear, actionable feature name
   - **User Story**: "As a [role], I want [feature], so that [benefit]"
   - **Priority**: CRITICAL/HIGH/MEDIUM/LOW
   - **Effort**: XS/S/M/L/XL
   - **Phase**: Select roadmap phase (0-6)
4. Click **Run workflow**

#### Option 3: From GitHub Issue

```bash
npm run backlog:create:from-issue -- --issue 123
```

### Syncing with GitHub Issues

#### Manual Sync

```bash
# Dry run to see what would be synced
npm run backlog:sync:dry-run

# Perform actual sync
npm run backlog:sync
```

#### Automated Sync

1. Go to **Actions** → **Backlog-Roadmap Sync**
2. Click **Run workflow**
3. Select **sync-from-github**
4. Click **Run workflow**

### Validating Consistency

```bash
# Validate backlog-roadmap consistency
npm run backlog:validate

# Check roadmap sync status
npm run roadmap:sync-status
```

## Backlog Item Format

Each backlog item follows this structure:

```markdown
- [ ] **[PRIORITY]** Clear, actionable title
  - **Roadmap Phase**: Phase X - Phase Name
  - **Roadmap Item**: Specific roadmap bullet point
  - **Effort**: XS/S/M/L/XL (time estimate)
  - **Description**: User story or feature description
  - **Acceptance Criteria**:
    - [ ] Criterion 1
    - [ ] Criterion 2
  - **Dependencies**: [List of prerequisite items]
  - **OpenSpec Change**: change-id
  - **Issue**: #123 (if from GitHub issue)
  - **Created**: YYYY-MM-DD
```

## Priority Levels

- **CRITICAL**: Blocking, urgent fix needed
  - Examples: Security vulnerabilities, broken builds, data loss
  - Timeline: Immediate (same day)

- **HIGH**: Important, should be done soon
  - Examples: Key features, performance issues, user-facing bugs
  - Timeline: Current sprint (1-2 weeks)

- **MEDIUM**: Normal priority
  - Examples: Feature enhancements, minor bugs, refactoring
  - Timeline: Next 1-2 sprints (2-4 weeks)

- **LOW**: Nice to have
  - Examples: Documentation improvements, minor UX enhancements
  - Timeline: Future sprints (1+ months)

## Effort Estimation

- **XS**: Few hours
  - Examples: Documentation updates, simple bug fixes
  - Complexity: Trivial changes, no testing required

- **S**: 1-2 days
  - Examples: Small features, configuration changes
  - Complexity: Single component, minimal testing

- **M**: 3-5 days
  - Examples: Medium features, API endpoints
  - Complexity: Multiple components, unit tests required

- **L**: 1-2 weeks
  - Examples: Large features, integrations
  - Complexity: Cross-component changes, integration tests

- **XL**: 2+ weeks
  - Examples: Major features, architectural changes
  - Complexity: System-wide changes, extensive testing

## Roadmap Phase Mapping

### Phase 0 - Project Bootstrap

- Infrastructure setup
- Development tooling
- CI/CD pipeline
- Documentation foundation

### Phase 1 - Agent Memory & Skills

- Agent definition and management
- Skill system implementation
- CLI command development
- Memory block support

### Phase 2 - Spec-Driven Development

- Workflow orchestration
- Artifact management
- OpenSpec integration
- Planning tools

### Phase 3 - Execution Engine & Guardrails

- Hook system implementation
- Safety mechanisms
- Quality checks
- Guardrail integration

### Phase 4 - Advanced Context Engineering

- Context isolation
- Subagent sandboxing
- Knowledge management
- MCP integration

### Phase 5 - Developer Tooling

- CLI diagnostics
- IDE integration
- Visualization tools
- Developer experience

### Phase 6 - Distribution & Ecosystem

- Package publication
- Documentation site
- Template library
- Release automation

## OpenSpec Integration

When you create a backlog item, the system automatically:

1. **Generates Change ID**: Kebab-case from title
2. **Creates Change Directory**: `openspec/changes/{change-id}/`
3. **Generates Proposal**: `proposal.md` with requirements
4. **Creates Tasks**: `tasks.md` with implementation steps
5. **Links to Backlog**: Updates backlog item with change ID

### OpenSpec Change Structure

```text
openspec/changes/{change-id}/
├── proposal.md          # Requirements and design
├── tasks.md            # Implementation tasks
└── specs/              # Technical specifications
```

## Workflow Integration

### Development Workflow

1. **Create Backlog Item**: Use CLI or GitHub Actions
2. **Review and Refine**: Update acceptance criteria
3. **Begin Implementation**: Follow tasks document
4. **Track Progress**: Update task completion
5. **Complete Item**: Mark as done, update roadmap

### Sprint Planning

1. **Review Backlog**: Check current items and priorities
2. **Validate Mapping**: Ensure roadmap alignment
3. **Estimate Capacity**: Based on team velocity
4. **Select Items**: Choose items for sprint
5. **Create Sprint Branch**: For sprint work

### Release Planning

1. **Review Roadmap**: Check phase completion
2. **Update Status**: Sync roadmap with backlog
3. **Plan Next Phase**: Based on completed work
4. **Communicate Changes**: Update stakeholders

## Automation Features

### Pre-commit Hooks

- Validates backlog-roadmap consistency
- Runs automatically on commit
- Prevents inconsistent states

### GitHub Actions

- **Backlog Creation**: UI-driven item creation
- **Issue Sync**: Automatic GitHub issue integration
- **Validation**: Consistency checks on PR
- **Status Updates**: Roadmap synchronization

### CLI Commands

- Interactive item creation
- Batch operations
- Validation and reporting
- Integration with development workflow

## Best Practices

### Writing Good Backlog Items

1. **Clear Titles**: Use action verbs, be specific
   - ✅ "Implement CLI help system"
   - ❌ "Help system"

2. **Proper User Stories**: Follow standard format
   - ✅ "As a developer, I want CLI help, so that I can discover available commands"
   - ❌ "Add help command"

3. **Specific Acceptance Criteria**: Testable conditions
   - ✅ "Help command displays all available commands with descriptions"
   - ❌ "Help works properly"

4. **Realistic Estimates**: Based on team experience
   - Consider complexity, dependencies, testing
   - Include buffer for unknowns

### Maintaining Consistency

1. **Regular Validation**: Run checks frequently

   ```bash
   npm run backlog:validate
   ```

2. **Update Roadmap**: When items are completed

   ```bash
   npm run roadmap:sync-status
   ```

3. **Review Dependencies**: Check for blocking items
4. **Sync with Issues**: Keep GitHub issues updated

### Team Collaboration

1. **Sprint Reviews**: Regular backlog grooming
2. **Estimation Sessions**: Team-based effort estimation
3. **Priority Discussions**: Stakeholder input on priorities
4. **Retrospectives**: Learn from completed items

## Troubleshooting

### Common Issues

#### Validation Failures

```bash
# Check specific validation errors
npm run backlog:validate --verbose

# Fix common issues
vim BACKLOG.md  # Update roadmap mappings
vim ROADMAP.md  # Update phase status
```

#### Sync Issues

```bash
# Check GitHub CLI authentication
gh auth status

# Re-authenticate if needed
gh auth login

# Test issue fetching
gh issue list --limit 5
```

#### OpenSpec Errors

```bash
# Check change directory structure
ls -la openspec/changes/

# Validate change proposals
find openspec/changes -name "proposal.md" -exec echo "Checking {}" \;
```

### Getting Help

1. **Check Documentation**: Review workflow files in `ai/workflows/`
2. **Run Validation**: Use `npm run backlog:validate` for specific errors
3. **Check Logs**: Review GitHub Actions logs for automation issues
4. **Ask Team**: Discuss in team channels or meetings

## Advanced Usage

### Custom Workflows

You can extend the system by:

1. Adding custom validation rules
2. Creating specialized sync scripts
3. Integrating with other tools
4. Customizing GitHub Actions

### Integration with Other Tools

- **Jira**: Export/import backlog items
- **Slack**: Notifications for backlog changes
- **IDE**: Extensions for backlog management
- **Analytics**: Track velocity and completion rates

### Reporting and Analytics

```bash
# Generate backlog reports
node scripts/backlog-report.js

# Analyze completion trends
node scripts/velocity-analysis.js

# Export for external tools
node scripts/export-backlog.js --format csv
```

## Summary

The backlog system provides:

- ✅ **Structured Planning**: Clear format and requirements
- ✅ **Roadmap Integration**: Strategic alignment
- ✅ **Automation**: Reduced manual work
- ✅ **Quality Gates**: Validation and consistency
- ✅ **Team Collaboration**: Shared understanding

Use this system to maintain high-quality, well-planned development work that aligns with strategic goals and delivers value incrementally.
