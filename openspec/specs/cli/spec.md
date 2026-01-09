# cli Specification

## Purpose

TBD - created by archiving change agent-memory-skills. Update Purpose after archive.

## Requirements

### Requirement: Initialization

The CLI SHALL provide an initialization command.

#### Scenario: Init Project

- **WHEN** `agent-scope init` is executed
- **THEN** an `.agent/` directory SHALL be created
- **AND** a default `AGENTS.md` file SHALL be created

### Requirement: Agent Management

The CLI SHALL provide commands to manage agents.

#### Scenario: List Agents

- **WHEN** `agent-scope agent list` is executed
- **THEN** a table of configured agents SHALL be displayed

#### Scenario: Add Agent

- **WHEN** `agent-scope agent add <name> --role <role> --scope <scope>` is executed
- **THEN** the new agent SHALL be added to the configuration

### Requirement: Skill Management

The CLI SHALL provide commands to manage skills.

#### Scenario: Add Skill

- **WHEN** `agent-scope skill add <name>` is executed
- **THEN** a new skill template file SHALL be created in `.agent/skills/`
