# Context Isolation Specification

## ADDED Requirements

### Requirement: Filesystem Isolation

The system SHALL enforce filesystem access restrictions based on agent scope.

#### Scenario: Agent can access files in scope

- **WHEN** agent accesses file within its scope
- **THEN** access is allowed

#### Scenario: Agent cannot access files outside scope

- **WHEN** agent attempts to access file outside its scope
- **THEN** access is denied with permission error

#### Scenario: Read-only scope prevents modifications

- **WHEN** agent has read-only scope
- **THEN** agent cannot create, modify, or delete files

#### Scenario: Wildcard patterns work correctly

- **WHEN** scope includes pattern `src/**/*.ts`
- **THEN** agent can access all TypeScript files in src/

### Requirement: Environment Isolation

The system SHALL isolate environment variables per agent.

#### Scenario: Agent receives defined environment variables

- **WHEN** agent executes
- **THEN** agent receives only explicitly defined environment variables

#### Scenario: Agent cannot access parent environment

- **WHEN** agent executes
- **THEN** agent cannot access environment variables from parent process

#### Scenario: Agent-specific variables are set

- **WHEN** agent has custom environment variables defined
- **THEN** those variables are available to agent

### Requirement: Process Isolation

The system SHALL run each agent in isolated process.

#### Scenario: Agent runs in separate process

- **WHEN** agent executes
- **THEN** agent runs in separate Node.js process

#### Scenario: Agent process has isolated memory

- **WHEN** agent executes
- **THEN** agent's memory is isolated from other agents

#### Scenario: Agent process can be terminated independently

- **WHEN** agent is cancelled
- **THEN** agent's process terminates without affecting other agents

### Requirement: Temporary Directory Isolation

The system SHALL provide isolated temporary directories for agents.

#### Scenario: Agent gets isolated temp directory

- **WHEN** agent executes
- **THEN** agent receives isolated temp directory at `$TEMP_DIR`

#### Scenario: Temp directory is cleaned up

- **WHEN** agent completes
- **THEN** agent's temp directory is deleted
