## Purpose

This specification defines the requirements for the Specification-Driven Development (SDD) workflow in agent-scope, including task management, validation, and implementation safety checks.

## Requirements

### Requirement: Implementation Safety

The `implement` command SHALL verify that a technical plan exists in `plans/` for the given change ID before proceeding.

#### Scenario: Missing plan

- **WHEN** running `agent-scope implement my-change`
- **THEN** output error message if `plans/my-change.md` does not exist

### Requirement: Task Verification

The `implement` command SHALL verify that the specified task (if provided via `--task`) exists in the change's `tasks.md`.

#### Scenario: Invalid task ID

- **WHEN** running `agent-scope implement my-change --task 9.9`
- **THEN** output error message if task `9.9` is not found

### Requirement: Roadmap Formatting Support

The `tasks sync` command SHALL correctly identify items in `ROADMAP.md` even when they are wrapped in bold markdown (e.g., `**Item Name:**`).

#### Scenario: Bold item in roadmap

- **WHEN** `BACKLOG.md` has a completed item for "My Feature"
- **AND** `ROADMAP.md` has `- [ ] **My Feature:** description`
- **THEN** `tasks sync` SHOULD mark the roadmap item as `[x]`

### Requirement: Structure Validation

The `validate structure` command SHALL verify that all mandatory SDD directories are present and contain a `template.md` (where applicable).

#### Scenario: Missing directory

- **WHEN** `specs/` director is missing
- **THEN** `validate structure` MUST fail

### Requirement: Agent-Scope Initialization

The `agent-scope init` command SHALL create the agent configuration structure and check for OpenSpec CLI availability.

#### Scenario: Successful initialization

- **WHEN** running `agent-scope init` in a project directory
- **THEN** the system SHALL create `.agent/agents/` and `.agent/workflows/` directories with default files

#### Scenario: OpenSpec not installed

- **WHEN** running `agent-scope init` and `openspec` CLI is not found
- **THEN** the system SHALL display a warning message with installation instructions but continue initialization

#### Scenario: Already initialized

- **WHEN** running `agent-scope init` and `.agent/` already exists
- **THEN** the system SHALL prompt user to confirm overwrite or skip

### Requirement: Agent Registry Management

The system SHALL maintain an agent registry in `.agent/agents/` with agent role definitions.

#### Scenario: List agents

- **WHEN** running `agent-scope agent list`
- **THEN** the system SHALL display all agent files from `.agent/agents/`

#### Scenario: Add new agent

- **WHEN** running `agent-scope agent add security-auditor`
- **THEN** the system SHALL create `.agent/agents/security-auditor.md` with template structure

#### Scenario: Validate agent definitions

- **WHEN** running `agent-scope agent validate`
- **THEN** the system SHALL check all agent files for required sections and report any issues

### Requirement: Agent Removal with Dependency Tracking

The `agent-scope agent remove` command SHALL check workflow dependencies before removing an agent.

#### Scenario: Agent used in workflows

- **WHEN** running `agent-scope agent remove architect`
- **AND** workflows in `.agent/workflows/` reference this agent
- **THEN** the system SHALL display which workflows use the agent and prompt for confirmation

#### Scenario: Agent not used

- **WHEN** running `agent-scope agent remove custom-agent`
- **AND** no workflows reference this agent
- **THEN** the system SHALL remove the agent file after confirmation

#### Scenario: Remove with force flag

- **WHEN** running `agent-scope agent remove architect --force`
- **THEN** the system SHALL remove the agent without checking dependencies

### Requirement: Workflow Management

The system SHALL manage workflows in `.agent/workflows/` that define agent sequences and orchestration.

#### Scenario: List workflows

- **WHEN** running `agent-scope workflow list`
- **THEN** the system SHALL display all workflow files from `.agent/workflows/`

#### Scenario: Validate workflow

- **WHEN** running `agent-scope workflow validate implement-feature`
- **THEN** the system SHALL verify that all referenced agents exist in `.agent/agents/`

#### Scenario: Run workflow

- **WHEN** running `agent-scope workflow run implement-feature my-feature`
- **THEN** the system SHALL execute agents in the sequence defined by the workflow

### Requirement: Default Agents Creation

The `agent-scope init` command SHALL create four default agent definitions.

#### Scenario: Architect agent created

- **WHEN** `agent-scope init` completes
- **THEN** `.agent/agents/architect.md` SHALL exist with complete agent definition

#### Scenario: Developer agent created

- **WHEN** `agent-scope init` completes
- **THEN** `.agent/agents/developer.md` SHALL exist with complete agent definition

#### Scenario: QA agent created

- **WHEN** `agent-scope init` completes
- **THEN** `.agent/agents/qa.md` SHALL exist with complete agent definition

#### Scenario: Reviewer agent created

- **WHEN** `agent-scope init` completes
- **THEN** `.agent/agents/reviewer.md` SHALL exist with complete agent definition

### Requirement: Default Workflows Creation

The `agent-scope init` command SHALL create default workflow definitions that integrate with OpenSpec.

#### Scenario: SDD cycle workflow created

- **WHEN** `agent-scope init` completes
- **THEN** `.agent/workflows/sdd-cycle.md` SHALL exist defining the standard SDD workflow

#### Scenario: Implement feature workflow created

- **WHEN** `agent-scope init` completes
- **THEN** `.agent/workflows/implement-feature.md` SHALL exist with multi-agent orchestration

#### Scenario: Workflows reference OpenSpec

- **WHEN** workflows are created
- **THEN** they SHALL include OpenSpec command integration (validate, archive)

### Requirement: OpenSpec Integration Check

The `agent-scope init` command SHALL check for OpenSpec CLI availability and provide appropriate guidance.

#### Scenario: OpenSpec installed

- **WHEN** running `agent-scope init` and `openspec` command is available
- **THEN** the system SHALL proceed with initialization without warnings

#### Scenario: OpenSpec missing

- **WHEN** running `agent-scope init` and `openspec` command is not found
- **THEN** the system SHALL display warning with installation instructions but continue initialization

#### Scenario: Warning message format

- **WHEN** OpenSpec is not installed
- **THEN** the warning SHALL include: detection message, affected workflows, installation command, and continuation notice
