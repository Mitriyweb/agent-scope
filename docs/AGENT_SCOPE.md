# Agent-Scope CLI

> **Status**: Planned - CLI implementation in progress

## Overview

`agent-scope` is a CLI tool for managing multi-agent workflows in AI-assisted development. It provides structured orchestration, role management, and workflow configuration.

## Concepts

### Agents

Agents are specialized roles that handle distinct phases of development:

- **Architect**: Research, planning, specification creation
- **Developer**: Code implementation based on specs
- **QA**: Testing, coverage validation, quality assurance
- **Reviewer**: Code review, standards compliance

Agent definitions are stored as markdown files with structured sections:

- Purpose
- Responsibilities
- Constraints
- Input Contract
- Output Contract
- Success Criteria
- Error Handling

### Workflows

Workflows define sequences of agents with approval gates between phases. They specify:

- Agent execution order
- Input/output contracts
- Approval requirements
- Success criteria

### Directory Structure

```text
Source (in repository):
/ai/
├── agents/                     # Agent definitions (source)
│   ├── architect.md
│   ├── developer.md
│   ├── qa.md
│   └── reviewer.md
└── workflows/                  # Workflow definitions (source)
    ├── sdd-cycle.md
    └── implement-feature.md

Build output (packaged with app):
/dist/templates/
├── agents/                     # Copied from ai/agents/
└── workflows/                  # Copied from ai/workflows/

User project (created by init):
.agent/
├── agents/                     # Copied from dist/templates/agents/
└── workflows/                  # Copied from dist/templates/workflows/
```

## Commands (Planned)

### Initialization

```bash
# Initialize agent-scope in current project
agent-scope init
```

Creates `.agent/` directory structure and copies default agents and workflows from templates.

**Checks**:

- Detects if `openspec` CLI is installed
- Displays warning (not error) if OpenSpec missing
- Provides installation instructions

### Agent Management

```bash
# List all available agents
agent-scope agent list

# Add new custom agent
agent-scope agent add <name>

# Remove agent (shows workflow dependencies)
agent-scope agent remove <name>

# Validate agent definitions
agent-scope agent validate
```

### Workflow Management

```bash
# List all workflows
agent-scope workflow list

# Validate workflow definition
agent-scope workflow validate <name>

# Run workflow (basic execution)
agent-scope workflow run <name> <feature>
```

## Integration with OpenSpec

Agent-scope is designed to work with OpenSpec methodology:

- `agent-scope init` checks for OpenSpec CLI availability
- Workflows reference OpenSpec commands (`openspec validate`, `openspec archive`)
- Agent definitions follow OpenSpec conventions
- Spec-driven development workflow supported

## Agent Definitions

### Source Location

Agent definitions are maintained in `ai/agents/` directory:

- `ai/agents/architect.md` - Architect agent definition
- `ai/agents/developer.md` - Developer agent definition
- `ai/agents/qa.md` - QA agent definition
- `ai/agents/reviewer.md` - Reviewer agent definition

### Template Structure

Each agent definition follows this structure:

```markdown
# [Agent Name] Agent

## Purpose

[One paragraph describing agent's primary purpose]

## Responsibilities

- [Specific responsibility 1]
- [Specific responsibility 2]

## Constraints

- [What agent CANNOT do]
- [What agent MUST NOT access]

## Input Contract

**Expected Inputs:**

- [Input 1 with format]

**Prerequisites:**

- [Prerequisite 1]

## Output Contract

**Expected Outputs:**

- [Output 1 with format]

**Success Criteria:**

- [ ] [Measurable criterion 1]

## Error Handling

- [How to handle specific error types]
```

## Workflow Definitions

### Workflow Source Location

Workflow definitions are maintained in `ai/workflows/`:

- `ai/workflows/sdd-cycle.md` - Standard SDD workflow
- `ai/workflows/implement-feature.md` - Feature implementation workflow

### Workflow Template Structure

```markdown
# [Workflow Name] Workflow

## Description

[Brief description of workflow purpose]

## Agent Sequence

### Phase 1: [Agent Name]

**Agent:** `architect`
**Approval Required:** Yes
**Inputs:**

- Feature request
- Existing specs

**Outputs:**

- proposal.md
- design.md

## OpenSpec Integration

- Uses `openspec validate` for validation
- Uses `openspec archive` after completion

## Success Criteria

- [ ] All phases complete
- [ ] All approvals granted
```

## Development Status

### Completed

- ✅ Agent definitions created (`ai/agents/*.md`)
- ✅ Documentation structure defined

### In Progress

- 🚧 CLI implementation
- 🚧 Build process for templates
- 🚧 Command implementations

### Planned

- ⏳ Full workflow execution engine
- ⏳ State persistence
- ⏳ Advanced orchestration features

## Contributing

To add or modify agents:

1. Edit files in `ai/agents/`
2. Follow the template structure
3. Ensure all required sections are present
4. Test with `agent-scope agent validate` (when available)

To add or modify workflows:

1. Edit files in `ai/workflows/`
2. Define clear agent sequences
3. Specify approval gates
4. Document OpenSpec integration points

## See Also

- [Agent Definitions Guide](./AGENT_DEFINITIONS.md)
- [Workflow Definitions Guide](./WORKFLOW_DEFINITIONS.md)
- [OpenSpec Documentation](../openspec/AGENTS.md)
