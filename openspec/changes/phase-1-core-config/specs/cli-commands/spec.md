# CLI Commands Specification

## ADDED Requirements

### Requirement: Agent Management Commands

The system SHALL provide CLI commands for managing agents.

#### Scenario: `agent-scope agent add` creates new agent

- **WHEN** user runs `agent-scope agent add --name=dev --role=developer`
- **THEN** a new agent is created and added to registry

#### Scenario: `agent-scope agent remove` deletes agent

- **WHEN** user runs `agent-scope agent remove --name=dev`
- **THEN** the agent is removed from registry

#### Scenario: `agent-scope agent list` shows all agents

- **WHEN** user runs `agent-scope agent list`
- **THEN** all agents are displayed with their roles and scopes

#### Scenario: Agent commands validate input

- **WHEN** user provides invalid agent name or role
- **THEN** command fails with clear error message

### Requirement: Role Management Commands

The system SHALL provide CLI commands for managing roles.

#### Scenario: `agent-scope role list` shows available roles

- **WHEN** user runs `agent-scope role list`
- **THEN** all built-in and custom roles are displayed

#### Scenario: Role list includes role descriptions

- **WHEN** user runs `agent-scope role list`
- **THEN** each role shows its name and description

### Requirement: Project Initialization

The system SHALL provide command to initialize project configuration.

#### Scenario: `agent-scope init` creates default configuration

- **WHEN** user runs `agent-scope init` in empty directory
- **THEN** a default `agents.json` file is created

#### Scenario: Init command creates example agents

- **WHEN** user runs `agent-scope init`
- **THEN** example agents are included in configuration

### Requirement: Configuration Validation

The system SHALL provide command to validate configuration.

#### Scenario: `agent-scope validate` checks configuration

- **WHEN** user runs `agent-scope validate`
- **THEN** configuration is validated against schema

#### Scenario: Validation reports all errors

- **WHEN** configuration has multiple errors
- **THEN** all errors are reported in one pass

#### Scenario: Validation succeeds for valid configuration

- **WHEN** configuration is valid
- **THEN** command exits with success status
