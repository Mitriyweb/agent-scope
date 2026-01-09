# Overall Design: agent-scope

## Section A: Architecture Overview

### Architecture Style

- **CLI-Driven Micro-Orchestrator**: Multi-agent system controlled via CLI.
- **Spec-Driven**: All transformations are guided by persistent specifications.
- **Plug-and-Play (Skills)**: Extensible via markdown-based skill definitions.

### System Layers

1. **CLI Layer**: Command parsing, routing, and user interface.
2. **Orchestration Layer**: Managing agent lifecycles and context handoffs.
3. **Skill Layer**: Dynamic loading of agent capabilities.
4. **Context Layer**: Directory-based isolation and sanitization.

## Section B: Requirements & Principles

### Core Principles

- **Context Isolation**: No agent has full project visibility.
- **Traceability**: Every code change maps to a task and a specification.
- **Validation-First**: No implementation proceeds without passing structural validation.

### Technical Requirements

- Language: TypeScript (Strict).
- Coverage: 85% branch coverage minimum.
- Distribution: NPM package.

## Section C: Technical Architecture

### Domain Model

The system uses **OpenSpec** as the canonical format for domain entities.

#### @DomainModel.Agent

- id: string
- name: string
- role: AgentRole
- scope: string[]
- description: string

#### @DomainModel.Skill

- id: string
- metadata: SkillMetadata
- instructions: string (Markdown)
- resources: ResourceReference[] (Level 3)

### API Contracts

The project uses **CLISPEC** for command interface definition.

#### @API.CLI.init

- `agent-scope init`: Initializes project with `.agent/` and `AGENTS.md`.

#### @API.CLI.agent

- `agent-scope agent add/list/remove`: Manages agent definitions.

#### @API.CLI.specify

- `agent-scope specify <name>`: Scaffolds a new specification.

## Section D: Additional Context

### Architecture Decisions

- Referred to [ADR.md](file:///Users/dmytro.zvieriev/sandbox/agent-scope/architecture/ADR.md) for detailed reasoning.
- Initial decision: Use TypeScript for its type safety and developer ecosystem.
