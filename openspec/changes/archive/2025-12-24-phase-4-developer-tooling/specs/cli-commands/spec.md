## ADDED Requirements

### Requirement: Explain Flow Command

The system SHALL provide an `agent-scope explain flow <flow-file>` command that displays detailed information about a flow definition.

#### Scenario: Display flow overview

- **WHEN** user runs `agent-scope explain flow my-flow.json`
- **THEN** system displays flow name, version, node count, and edge count

#### Scenario: Display node details

- **WHEN** user runs `agent-scope explain flow my-flow.json --nodes`
- **THEN** system lists all nodes with agent names and input mappings

#### Scenario: Display edge details

- **WHEN** user runs `agent-scope explain flow my-flow.json --edges`
- **THEN** system lists all edges with source, target, and artifact names

#### Scenario: Handle missing file

- **WHEN** user runs `agent-scope explain flow nonexistent.json`
- **THEN** system displays error message with file path and suggestion

### Requirement: Explain Agent Command

The system SHALL provide an `agent-scope explain agent <agent-name>` command that displays agent configuration and capabilities.

#### Scenario: Display agent details

- **WHEN** user runs `agent-scope explain agent analyzer`
- **THEN** system displays agent name, role, scope, and configuration

#### Scenario: Display agent capabilities

- **WHEN** user runs `agent-scope explain agent analyzer --capabilities`
- **THEN** system lists all capabilities defined for the agent

#### Scenario: Handle unknown agent

- **WHEN** user runs `agent-scope explain agent unknown-agent`
- **THEN** system displays error and suggests similar agent names

### Requirement: Explain Role Command

The system SHALL provide an `agent-scope explain role <role-name>` command that displays role definition and responsibilities.

#### Scenario: Display role details

- **WHEN** user runs `agent-scope explain role developer`
- **THEN** system displays role name, responsibilities, and allowed outputs

#### Scenario: Display role agents

- **WHEN** user runs `agent-scope explain role developer --agents`
- **THEN** system lists all agents with this role

#### Scenario: Handle unknown role

- **WHEN** user runs `agent-scope explain role unknown-role`
- **THEN** system displays error and lists available roles

### Requirement: Graph Flow Command

The system SHALL provide an `agent-scope graph flow <flow-file>` command that renders an ASCII visualization of a flow.

#### Scenario: Display flow graph

- **WHEN** user runs `agent-scope graph flow my-flow.json`
- **THEN** system displays ASCII graph showing nodes and edges

#### Scenario: Graph with artifact labels

- **WHEN** user runs `agent-scope graph flow my-flow.json --labels`
- **THEN** system displays graph with artifact names on edges

#### Scenario: Graph in JSON format

- **WHEN** user runs `agent-scope graph flow my-flow.json --format json`
- **THEN** system outputs graph structure as JSON for programmatic use

### Requirement: Graph Agents Command

The system SHALL provide an `agent-scope graph agents` command that renders agent relationships.

#### Scenario: Display agent graph

- **WHEN** user runs `agent-scope graph agents`
- **THEN** system displays ASCII graph showing agent connections

#### Scenario: Graph filtered by role

- **WHEN** user runs `agent-scope graph agents --role developer`
- **THEN** system displays graph with only agents of specified role

### Requirement: Graph Dependencies Command

The system SHALL provide an `agent-scope graph dependencies` command that renders dependency relationships.

#### Scenario: Display dependency graph

- **WHEN** user runs `agent-scope graph dependencies`
- **THEN** system displays ASCII graph showing file and module dependencies

#### Scenario: Graph with depth limit

- **WHEN** user runs `agent-scope graph dependencies --depth 2`
- **THEN** system displays graph limited to specified depth

## MODIFIED Requirements

### Requirement: Error Messages

The system SHALL display clear, actionable error messages with context and suggestions.

#### Scenario: Validation error with suggestion

- **WHEN** flow validation fails due to missing input
- **THEN** system displays error message, context, and suggestion for fix

#### Scenario: File not found with suggestion

- **WHEN** user references nonexistent file
- **THEN** system displays error and suggests similar file names

#### Scenario: Quiet mode suppresses suggestions

- **WHEN** user runs command with `--quiet` flag
- **THEN** system displays only error message without suggestions
