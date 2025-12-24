## ADDED Requirements

### Requirement: Project Templates

The system SHALL provide project templates for common agent-flow patterns.

#### Scenario: List available templates

- **WHEN** user runs `agent-scope init --list-templates`
- **THEN** system displays all available templates with descriptions

#### Scenario: Initialize from template

- **WHEN** user runs `agent-scope init my-project --template basic-flow`
- **THEN** system creates project directory with template files

#### Scenario: Template includes sample agents

- **WHEN** user initializes from template
- **THEN** project includes sample agent configurations with comments

#### Scenario: Template includes sample flows

- **WHEN** user initializes from template
- **THEN** project includes sample flow definitions demonstrating patterns

### Requirement: Role Presets

The system SHALL provide preset configurations for standard roles.

#### Scenario: List available presets

- **WHEN** user runs `agent-scope init --list-presets`
- **THEN** system displays all available role presets

#### Scenario: Initialize with preset

- **WHEN** user runs `agent-scope init my-project --preset standard-roles`
- **THEN** system creates project with standard roles (developer, qa, architect, reviewer)

#### Scenario: Preset includes role definitions

- **WHEN** user initializes with preset
- **THEN** project includes role definitions with responsibilities and outputs

### Requirement: Flow Presets

The system SHALL provide preset flow patterns for common scenarios.

#### Scenario: List flow presets

- **WHEN** user runs `agent-scope flow --list-presets`
- **THEN** system displays available flow patterns (sequential, parallel, fan-out/fan-in)

#### Scenario: Create flow from preset

- **WHEN** user runs `agent-scope flow create my-flow --preset sequential`
- **THEN** system creates flow file with sequential pattern template

#### Scenario: Preset includes documentation

- **WHEN** user creates flow from preset
- **THEN** flow file includes comments explaining the pattern

### Requirement: OpenSpec Templates

The system SHALL provide templates for creating OpenSpec specifications.

#### Scenario: Create spec from template

- **WHEN** user runs `agent-scope spec create my-capability --template capability`
- **THEN** system creates spec file with ADDED/MODIFIED/REMOVED sections

#### Scenario: Spec template includes scenarios

- **WHEN** user creates spec from template
- **THEN** spec includes example scenario format with WHEN/THEN structure

#### Scenario: Agent spec template

- **WHEN** user runs `agent-scope spec create agents --template agent`
- **THEN** system creates agent spec with agent definition requirements

#### Scenario: Flow spec template

- **WHEN** user runs `agent-scope spec create flows --template flow`
- **THEN** system creates flow spec with flow definition requirements
