# Design: Multi-Agent SDD Cycle with agent-scope

## Context

Current AI-assisted development workflows lack structured multi-agent orchestration. Teams need:

- **Reusable agent definitions**: Define agent roles once, use across workflows
- **Configurable workflows**: Custom sequences of agents for different scenarios
- **Dependency tracking**: Know which workflows use which agents
- **OpenSpec integration**: Leverage existing spec-driven methodology

This design introduces `agent-scope` CLI for managing agents and workflows.

## Goals / Non-Goals

### Goals

- Provide CLI for initializing and managing agent configurations
- Store agent definitions in `.agent-scope/agents/` as markdown files
- Store workflow definitions in `.agent-scope/workflows/` as markdown files
- Track dependencies between agents and workflows
- Integrate with OpenSpec methodology (detect CLI, use commands)
- Support adding/removing custom agents
- Validate agent and workflow definitions

### Non-Goals

- Full workflow execution engine (deferred to future phase)
- Agent-to-agent direct communication (artifact-based only)
- Parallel agent execution (sequential only for v1)
- Custom workflow DSL (markdown-based definitions for v1)
- State persistence across workflow runs (future phase)

## Architecture

### Directory Structure

```text
Source (in repository):
/ai/
├── rules/                      # General rules (not copied)
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
│   ├── architect.md
│   ├── developer.md
│   ├── qa.md
│   └── reviewer.md
└── workflows/                  # Copied from ai/workflows/
    ├── sdd-cycle.md
    └── implement-feature.md

User project (created by init):
.agent-scope/
├── agents/                     # Copied from dist/templates/agents/
│   ├── architect.md
│   ├── developer.md
│   ├── qa.md
│   └── reviewer.md
└── workflows/                  # Copied from dist/templates/workflows/
    ├── sdd-cycle.md
    └── implement-feature.md
```

### CLI Command Structure

```text
agent-scope
├── init                        # Initialize .agent-scope/
├── agent
│   ├── add <name>             # Create new agent
│   ├── remove <name>          # Remove agent (shows dependencies)
│   ├── list                   # List all agents
│   └── validate               # Validate agent definitions
└── workflow
    ├── run <name> <feature>   # Execute workflow (basic v1)
    ├── list                   # List all workflows
    └── validate <name>        # Validate workflow definition
```

### Component Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                  agent-scope CLI                         │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼────┐ ┌───▼────┐ ┌───▼────────┐
    │  Init   │ │ Agent  │ │  Workflow  │
    │ Command │ │Commands│ │  Commands  │
    └────┬────┘ └───┬────┘ └───┬────────┘
         │          │           │
         │          │           │
    ┌────▼──────────▼───────────▼────────┐
    │      Template Manager               │
    │  - Agent templates                  │
    │  - Workflow templates               │
    └────┬────────────────────────────────┘
         │
    ┌────▼────────────────────────────────┐
    │   File System Operations            │
    │  - .agent-scope/agents/             │
    │  - .agent-scope/workflows/          │
    └─────────────────────────────────────┘
```

## Decisions

### Decision 1: Markdown-Based Configuration

**Choice**: Use markdown files for agent and workflow definitions.

**Rationale**:

- Human-readable and editable
- Version control friendly
- Supports rich documentation
- Consistent with OpenSpec methodology
- No need for custom parsers

**Alternatives Considered**:

- YAML/JSON: Rejected as less readable for documentation-heavy content
- Custom DSL: Rejected as over-engineered for v1

### Decision 2: Three-Tier File Structure

**Choice**: Source files in `ai/agents/` and `ai/workflows/`, build to `dist/templates/`, init copies to `.agent-scope/`.

**Rationale**:

- Clear separation: source vs packaged vs user files
- Developers work in `ai/` directory (consistent with existing structure)
- Build process packages templates with application
- Users get clean copies they can customize
- No confusion between source and user files

**Alternatives Considered**:

- Direct copy from `ai/` to `.agent-scope/`: Rejected as mixes source and user concerns
- Templates in separate repo: Rejected as adds deployment complexity

### Decision 3: Dependency Tracking on Remove

**Choice**: `agent-scope agent remove` scans workflows and shows dependencies before removal.

**Rationale**:

- Prevents accidental breakage
- Provides visibility into agent usage
- Allows informed decision-making
- Simple implementation (grep workflow files)

**Alternatives Considered**:

- No dependency tracking: Rejected as too risky
- Prevent removal if used: Rejected as too restrictive (--force flag provides escape hatch)

### Decision 4: OpenSpec Detection as Warning

**Choice**: `agent-scope init` checks for OpenSpec but only warns if missing.

**Rationale**:

- agent-scope can be useful without OpenSpec
- Some workflows may not need OpenSpec
- Users can install OpenSpec later
- Non-blocking initialization improves UX

**Alternatives Considered**:

- Hard requirement: Rejected as too restrictive
- No check at all: Rejected as users may be confused when workflows fail

### Decision 5: Template-Based Agent/Workflow Creation

**Choice**: Use templates for creating new agents and workflows.

**Rationale**:

- Ensures consistency
- Provides structure and guidance
- Easy to maintain and update
- Reduces errors in manual creation

**Alternatives Considered**:

- Interactive prompts: Deferred to future version
- Empty files: Rejected as provides no guidance

## Technical Specifications

### Agent Definition Structure

```markdown
# [Agent Name] Agent

## Purpose

[One paragraph describing agent's primary purpose]

## Responsibilities

- [Specific responsibility 1]
- [Specific responsibility 2]
- ...

## Constraints

- [What agent CANNOT do]
- [What agent MUST NOT access]
- ...

## Input Contract

**Expected Inputs:**

- [Input 1 with format]
- [Input 2 with format]

**Prerequisites:**

- [Prerequisite 1]
- [Prerequisite 2]

## Output Contract

**Expected Outputs:**

- [Output 1 with format]
- [Output 2 with format]

**Success Criteria:**

- [ ] [Measurable criterion 1]
- [ ] [Measurable criterion 2]

## Error Handling

- [How to handle specific error types]
- [Recovery procedures]
```

### Workflow Definition Structure

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
- spec deltas

### Phase 2: [Agent Name]

**Agent:** `developer`
**Approval Required:** Yes
**Inputs:**

- Approved specs
- tasks.md

**Outputs:**

- Source code
- Unit tests

## OpenSpec Integration

- Uses `openspec validate` for spec validation
- Uses `openspec archive` after completion

## Success Criteria

- [ ] All phases complete
- [ ] All approvals granted
- [ ] Tests pass
```

### OpenSpec Detection

```typescript
class OpenSpecDetector {
  isInstalled(): boolean {
    // Execute: which openspec
    // Return true if exit code 0
  }

  getVersion(): string | null {
    // Execute: openspec --version
    // Parse and return version
  }

  getWarningMessage(): string {
    return `
⚠️  Warning: openspec CLI not found

   Some workflows (sdd-cycle, implement-feature) require openspec.
   
   Install openspec:
   npm install -g openspec
   
   You can still use agent-scope, but openspec-dependent workflows
   will not work until openspec is installed.
`;
  }
}
```

### Dependency Analysis

```typescript
class AgentDependencyAnalyzer {
  findWorkflowsUsingAgent(agentName: string): WorkflowDependency[] {
    // 1. Read all files from .agent-scope/workflows/
    // 2. Parse each file for agent references
    // 3. Return list of workflows that reference the agent
    // Example output:
    // [
    //   { workflow: 'implement-feature.md', line: 15, context: '**Agent:** `architect`' },
    //   { workflow: 'sdd-cycle.md', line: 8, context: '**Agent:** `architect`' }
    // ]
  }

  formatDependencyWarning(agentName: string, dependencies: WorkflowDependency[]): string {
    return `
⚠️  Role '${agentName}' is used in workflows:
${dependencies.map(d => `- ${d.workflow} (line ${d.line})`).join('\n')}

Remove anyway? [y/N]
`;
  }
}
```

### Agent Validation

```typescript
interface AgentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

class AgentDefinitionValidator {
  private requiredSections = [
    'Purpose',
    'Responsibilities',
    'Constraints',
    'Input Contract',
    'Output Contract',
    'Success Criteria',
  ];

  validate(agentFilePath: string): AgentValidationResult {
    // 1. Read agent file
    // 2. Parse markdown structure
    // 3. Check for required sections
    // 4. Validate section content
    // 5. Return validation result
  }
}
```

## Risks / Trade-offs

### Risk 1: Markdown Parsing Complexity

**Risk**: Parsing markdown for workflow definitions may be fragile.

**Mitigation**:

- Use simple, structured format
- Provide clear templates
- Implement robust parser with error handling
- Validate workflow files on creation

**Trade-off**: Accept some parsing complexity for human-readable format.

### Risk 2: Manual Workflow Definition

**Risk**: Users may create invalid workflow definitions.

**Mitigation**:

- Provide templates with examples
- Implement validation command
- Show clear error messages
- Document workflow format thoroughly

**Trade-off**: Manual editing provides flexibility but requires validation.

### Risk 3: Limited Workflow Execution in V1

**Risk**: Basic workflow execution may not meet all needs.

**Mitigation**:

- Focus on configuration management for v1
- Defer full orchestration to future phase
- Provide clear roadmap for enhancements
- Ensure architecture supports future expansion

**Trade-off**: Ship useful tool quickly, iterate based on feedback.

## Migration Plan

### Phase 1: CLI Infrastructure (Week 1)

- Implement `agent-scope` CLI entry point
- Create command structure
- Implement `init` command
- Create template system

### Phase 2: Agent Management (Week 2)

- Implement agent add/remove/list/validate commands
- Create dependency analyzer
- Implement agent validation
- Create default agent templates

### Phase 3: Workflow Management (Week 3)

- Implement workflow list/validate commands
- Create workflow validation
- Create default workflow templates
- Implement basic workflow run command

### Phase 4: Testing & Documentation (Week 4)

- Write comprehensive tests
- Create documentation
- Update existing workflows
- Manual testing and refinement

## Open Questions

1. **Should workflow definitions support variables/parameters?**
   - Deferred to v2 based on user feedback

2. **Should we support workflow composition (workflows calling workflows)?**
   - Deferred to v2, start with flat workflows

3. **How to handle workflow execution state?**
   - Deferred to future phase when full orchestration is implemented

4. **Should agents have access to external tools/APIs?**
   - Deferred to v2, start with file-based operations only

5. **How to version agent and workflow definitions?**
   - Use git for versioning (files are in version control)
   - Consider explicit version field in future

## Success Metrics

- [ ] `agent-scope init` successfully creates directory structure
- [ ] OpenSpec detection works with appropriate warning
- [ ] All four default agents created with valid definitions
- [ ] Both default workflows created with valid definitions
- [ ] `agent-scope agent remove` correctly shows dependencies
- [ ] Agent and workflow validation catches common errors
- [ ] Test coverage maintained at 85%+
- [ ] Documentation complete and clear
- [ ] Manual testing confirms all commands work as expected
