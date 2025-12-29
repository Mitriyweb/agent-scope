# Capability: Agent Configuration

**Feature**: Agent Primitives
**Status**: DRAFT

## ADDED Requirements

### Requirement: Agent Definition

Agents SHALL be defined with explicit configuration properties.

#### Scenario: Agent Configuration Properties

- **WHEN** an agent is defined
- **THEN** it SHALL have the following properties:
  - `name`: Unique string identifier
  - `role`: One of the standard or custom roles
  - `description`: Human-readable purpose
  - `scope`: List of allowed file paths or glob patterns
  - `model`: (Optional) AI model identifier

### Requirement: Standard Roles

The system SHALL provide built-in standard roles.

#### Scenario: Built-in Roles

- **WHEN** the system initializes
- **THEN** the following roles SHALL be available:
  - `developer`
  - `qa`
  - `spec`
  - `reviewer`

### Requirement: AGENTS.md Support

The system SHALL support an `AGENTS.md` file for defining project-level agent instructions.

#### Scenario: Loading Agent Instructions

- **WHEN** `AGENTS.md` exists in the project root
- **THEN** its content SHALL be parsed and available to agents as memory blocks
