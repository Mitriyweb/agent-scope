# Change: Multi-Agent SDD Cycle with agent-scope

## Why

The current workflow lacks a structured multi-agent orchestration system. AI-assisted development would benefit from:

1. **Specialized agent roles**: Different phases (architecture, development, QA, review) require different expertise
2. **Configurable workflows**: Teams need to define custom workflows with specific agent sequences
3. **Reusable agent definitions**: Agent roles should be defined once and reused across workflows
4. **Dependency tracking**: System should know which workflows use which agents
5. **Integration with OpenSpec**: Workflows should leverage existing OpenSpec methodology

A multi-agent system with `agent-scope` CLI provides structured orchestration, role management, and workflow configuration.

## What Changes

Introduce **agent-scope CLI** for managing multi-agent workflows:

### 1. Agent Configuration System

**Source Location**: `ai/agents/` (in repository)
**Build Output**: `dist/templates/agents/` (packaged with app)
**User Location**: `.agent-scope/agents/` (created by init)

Default agents created by `agent-scope init`:

- `architect.md` - Research, planning, specification creation
- `developer.md` - Code implementation based on specs
- `qa.md` - Testing, coverage validation, quality assurance
- `reviewer.md` - Code review, standards compliance

**Flow**:

1. Developers write agent definitions in `ai/agents/`
2. Build process copies to `dist/templates/agents/`
3. `agent-scope init` copies from `dist/templates/agents/` to `.agent-scope/agents/`
4. Users can customize their copies in `.agent-scope/agents/`

**Management commands**:

- `agent-scope agent add <name>` - Create new agent role
- `agent-scope agent remove <name>` - Remove agent (shows workflow dependencies)
- `agent-scope agent list` - List all available agents
- `agent-scope agent validate` - Validate all agent definitions

### 2. Workflow System

**Source Location**: `ai/workflows/` (in repository)
**Build Output**: `dist/templates/workflows/` (packaged with app)
**User Location**: `.agent-scope/workflows/` (created by init)

Default workflows created by `agent-scope init`:

- `sdd-cycle.md` - Standard SDD workflow (specify → plan → tasks → implement)
- `implement-feature.md` - Feature implementation with multi-agent orchestration

**Flow**:

1. Developers write workflow definitions in `ai/workflows/`
2. Build process copies to `dist/templates/workflows/`
3. `agent-scope init` copies from `dist/templates/workflows/` to `.agent-scope/workflows/`
4. Users can customize their copies in `.agent-scope/workflows/`

Workflows define:

- Agent sequence and dependencies
- Approval gates between phases
- Input/output contracts
- Success criteria

### 3. CLI Commands

```bash
# Initialize agent-scope (checks for openspec)
agent-scope init

# Run workflow
agent-scope workflow run <workflow-name> <feature-name>

# Agent management
agent-scope agent add <name>
agent-scope agent remove <name>
agent-scope agent list
agent-scope agent validate

# Workflow management
agent-scope workflow list
agent-scope workflow validate <name>
```

### 4. OpenSpec Integration

- `agent-scope init` checks for `openspec` CLI (warning if not installed)
- Workflows use OpenSpec commands: `openspec validate`, `openspec archive`
- Agent definitions reference OpenSpec methodology

### Breaking Changes

- **BREAKING**: New `.agent-scope/` directory structure required
- **BREAKING**: Workflows must be defined in `.agent-scope/workflows/`
- **BREAKING**: Agent roles must be defined in `.agent-scope/agents/`

## Impact

### Affected Specs

- `openspec/specs/sdd-workflow/spec.md` - Add agent-scope requirements
- New capability: `openspec/specs/agent-scope/spec.md` - Define agent-scope CLI

### Affected Code

- New CLI: `agent-scope` command with subcommands
- New directory structure: `.agent-scope/agents/` and `.agent-scope/workflows/`
- Source files:
  - `ai/agents/architect.md`
  - `ai/agents/developer.md`
  - `ai/agents/qa.md`
  - `ai/agents/reviewer.md`
  - `ai/workflows/sdd-cycle.md` (updated)
  - `ai/workflows/implement-feature.md` (updated)
- Build output:
  - `dist/templates/agents/*.md`
  - `dist/templates/workflows/*.md`
- User files (created by init):
  - `.agent-scope/agents/*.md`
  - `.agent-scope/workflows/*.md`

### Affected Workflows

- Teams can define custom workflows with specific agent sequences
- Workflows reference agents from `.agent-scope/agents/`
- Removing an agent shows which workflows depend on it
- Better audit trail with phase-specific artifacts

## Migration Path

1. Run `agent-scope init` to create `.agent-scope/` structure
2. System checks for `openspec` CLI (warning if missing)
3. Default agents and workflows created automatically
4. Teams can add custom agents via `agent-scope agent add`
5. Teams can define custom workflows in `.agent-scope/workflows/`

## Success Criteria

- [ ] `agent-scope init` creates complete directory structure
- [ ] OpenSpec detection works with appropriate warning
- [ ] All four default agents created with proper definitions
- [ ] Both default workflows (sdd-cycle, implement-feature) created
- [ ] `agent-scope agent remove` shows workflow dependencies
- [ ] Workflow execution orchestrates agents correctly
- [ ] Documentation updated (README, ROADMAP, BACKLOG)
- [ ] Test coverage maintained at 85%+
