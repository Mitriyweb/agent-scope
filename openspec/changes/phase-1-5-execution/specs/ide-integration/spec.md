# IDE Integration Specification

## ADDED Requirements

### Requirement: VS Code Extension

The system SHALL provide a VS Code extension for agent execution.

#### Scenario: Extension shows available agents

- **WHEN** the extension is opened
- **THEN** it displays all configured agents

#### Scenario: Agent can be executed from VS Code

- **WHEN** user clicks execute on an agent
- **THEN** the agent runs and results are shown

#### Scenario: Workflows can be executed from VS Code

- **WHEN** user selects a workflow
- **THEN** it executes with real-time progress

### Requirement: JetBrains Plugin

The system SHALL provide a JetBrains plugin for agent execution.

#### Scenario: Plugin integrates with IDE

- **WHEN** the plugin is installed
- **THEN** it appears in Tools menu

#### Scenario: Agent execution from JetBrains

- **WHEN** user executes an agent
- **THEN** results appear in run panel

### Requirement: Neovim Plugin

The system SHALL provide a Neovim plugin for agent execution.

#### Scenario: Neovim commands are available

- **WHEN** Neovim is configured
- **THEN** `:AgentScope` commands are available

#### Scenario: Agent execution in Neovim

- **WHEN** user runs agent command
- **THEN** results appear in terminal

### Requirement: IDE Protocol

The system SHALL use a language-agnostic protocol for IDE communication.

#### Scenario: Protocol is JSON-RPC based

- **WHEN** IDE communicates with execution engine
- **THEN** JSON-RPC protocol is used

#### Scenario: Real-time updates are sent

- **WHEN** agent is executing
- **THEN** IDE receives real-time status updates
