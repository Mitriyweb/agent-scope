# IDE Integration Specification

## ADDED Requirements

### Requirement: VS Code Integration

The system SHALL provide VS Code extension for agent execution and workflow management.

#### Scenario: VS Code extension is installed

- **WHEN** user installs agent-scope VS Code extension
- **THEN** extension appears in VS Code sidebar with agent list

#### Scenario: Agent execution from VS Code

- **WHEN** user clicks "Run" on an agent in VS Code
- **THEN** agent executes and results appear in output panel

#### Scenario: Workflow execution from VS Code

- **WHEN** user selects workflow and clicks "Run"
- **THEN** workflow executes with progress visualization

#### Scenario: Scope visualization in VS Code

- **WHEN** agent is selected in VS Code
- **THEN** agent's scope is highlighted in file explorer

### Requirement: JetBrains IDE Integration

The system SHALL provide JetBrains plugin for agent execution (IntelliJ, PyCharm, WebStorm, etc.).

#### Scenario: JetBrains plugin is installed

- **WHEN** user installs agent-scope plugin in JetBrains IDE
- **THEN** plugin appears in Tools menu

#### Scenario: Agent execution from JetBrains

- **WHEN** user runs agent from Tools menu
- **THEN** agent executes in IDE's run panel

#### Scenario: Workflow execution from JetBrains

- **WHEN** user selects workflow from Tools menu
- **THEN** workflow executes with step-by-step visualization

### Requirement: Neovim Integration

The system SHALL provide Neovim plugin for agent execution.

#### Scenario: Neovim plugin is installed

- **WHEN** user installs agent-scope plugin in Neovim
- **THEN** plugin commands are available

#### Scenario: Agent execution from Neovim

- **WHEN** user runs `:AgentScope execute backend-dev`
- **THEN** agent executes in Neovim terminal

### Requirement: IDE Protocol

The system SHALL define protocol for IDE communication with agent-scope.

#### Scenario: IDE sends execution request

- **WHEN** IDE sends JSON-RPC request to execute agent
- **THEN** agent-scope processes request and returns results

#### Scenario: IDE receives execution updates

- **WHEN** agent executes
- **THEN** IDE receives real-time updates (started, progress, completed)

#### Scenario: IDE displays execution results

- **WHEN** agent completes
- **THEN** IDE displays results (exit code, output, logs)
