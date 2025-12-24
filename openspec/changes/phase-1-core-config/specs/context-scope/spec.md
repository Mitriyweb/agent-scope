# Context and Scope Specification

## ADDED Requirements

### Requirement: File and Directory-Based Scoping

The system SHALL support scoping agents to specific files and directories.

#### Scenario: Agent scope defined with directory patterns

- **WHEN** an agent scope includes directory patterns
- **THEN** the agent can only access files matching those patterns

#### Scenario: Scope patterns support wildcards

- **WHEN** scope patterns include `*` or `**` wildcards
- **THEN** patterns match multiple files/directories

#### Scenario: Scope resolution is deterministic

- **WHEN** multiple scope patterns apply to a file
- **THEN** the most specific pattern takes precedence

### Requirement: Read-Only vs Read-Write Flags

The system SHALL support read-only and read-write access modes.

#### Scenario: Read-only scope prevents modifications

- **WHEN** an agent has read-only scope
- **THEN** the agent cannot modify files in that scope

#### Scenario: Read-write scope allows modifications

- **WHEN** an agent has read-write scope
- **THEN** the agent can read and modify files in that scope

#### Scenario: Default scope is read-write

- **WHEN** scope is defined without explicit read-only flag
- **THEN** scope defaults to read-write access

### Requirement: Deterministic Scope Resolution

The system SHALL resolve scope conflicts consistently.

#### Scenario: Overlapping patterns are resolved by specificity

- **WHEN** multiple scope patterns overlap
- **THEN** the most specific pattern determines access

#### Scenario: Scope resolution is reproducible

- **WHEN** scope is resolved multiple times
- **THEN** the result is always the same
