# Backlog

This document tracks the tactical, sprint-level work items for the **agent-scope** project. Each item maps to a specific roadmap phase and includes detailed implementation requirements.

## Overview

- **Purpose**: Sprint-level tasks and immediate work (1-4 week horizon)
- **Granularity**: Specific tasks and user stories
- **Audience**: Developers, QA, immediate team
- **Relationship**: Maps to strategic roadmap phases in `ROADMAP.md`

## Priority Legend

- **CRITICAL**: Blocking, urgent fix needed
- **HIGH**: Important, should be done soon
- **MEDIUM**: Normal priority
- **LOW**: Nice to have

## Effort Scale

- **XS**: Few hours
- **S**: 1-2 days
- **M**: 3-5 days
- **L**: 1-2 weeks
- **XL**: 2+ weeks

---

## Pending Tasks

- [ ] **[MEDIUM]** Implement workflow management commands
  - **Roadmap Phase**: Phase 2 - Spec-Driven Development (SDD)
  - **Roadmap Item**: - [ ] **Workflow Definitions:** Configurable agent sequences with approval gates
  - **Effort**: L
  - **Description**: As a developer, I want workflow management commands (list, validate, run), so that I can manage multi-agent workflows
  - **Acceptance Criteria**:
    - [ ] `agent-scope workflow list` displays all workflows
    - [ ] `agent-scope workflow validate` checks workflow definitions
    - [ ] `agent-scope workflow run` executes basic workflow
  - **Dependencies**: Agent definitions, workflow templates
  - **OpenSpec Change**: add-multi-agent-sdd-cycle
  - **Created**: 2025-12-30

- [ ] **[MEDIUM]** Implement agent dependency tracking
  - **Roadmap Phase**: Phase 2 - Spec-Driven Development (SDD)
  - **Roadmap Item**: - [ ] **Dependency Tracking:** System tracks which workflows use which agents
  - **Effort**: M
  - **Description**: As a developer, I want agent remove to show workflow dependencies, so that I don't accidentally break workflows
  - **Acceptance Criteria**:
    - [ ] `agent-scope agent remove` scans workflows for agent usage
    - [ ] Shows list of workflows using the agent
    - [ ] Prompts for confirmation before removal
  - **Dependencies**: Workflow definitions
  - **OpenSpec Change**: add-multi-agent-sdd-cycle
  - **Created**: 2025-12-30

- [ ] **[LOW]** Implement template build system
  - **Roadmap Phase**: Phase 2 - Spec-Driven Development (SDD)
  - **Roadmap Item**: - [ ] **Template Build System:** Copy agent/workflow templates to dist/ for distribution
  - **Effort**: S
  - **Description**: As a developer, I want build process to copy templates, so that they're packaged with the application
  - **Acceptance Criteria**:
    - [ ] Build script copies `ai/agents/*.md` to `dist/templates/agents/`
    - [ ] Build script copies `ai/workflows/*.md` to `dist/templates/workflows/`
    - [ ] Templates included in npm package
  - **Dependencies**: Agent and workflow definitions
  - **OpenSpec Change**: add-multi-agent-sdd-cycle
  - **Created**: 2025-12-30

- [ ] **[MEDIUM]** Implement Level 3 Resources for Skills
  - **Roadmap Phase**: Phase 1 - Agent Memory & Skills
  - **Roadmap Item**: - [ ] **Level 3 (Resources):** External code/docs loaded into context as needed.
  - **Effort**: L
  - **Description**: As a developer, I want Level 3 Resources support for skills, so that external code and docs can be loaded into context as needed
  - **Acceptance Criteria**:
    - [ ] [To be defined]
  - **Dependencies**: Level 1 and Level 2 Skills implementation
  - **OpenSpec Change**: implement-level-3-resources-for-skills
  - **Created**: 2025-12-29

- [ ] **[HIGH]** Implement backlog validation CLI command
  - **Roadmap Phase**: Phase 0 - Project Bootstrap
  - **Roadmap Item**: - [x] Repository structure (`src/`, `bin/`, `tests/`, `docs/`)
  - **Effort**: S
  - **Description**: As a developer, I want a CLI command to validate backlog consistency, so that I can ensure proper roadmap alignment
  - **Acceptance Criteria**:
    - [ ] [To be defined]
  - **Dependencies**: CLI framework and TypeScript setup
  - **OpenSpec Change**: implement-backlog-validation-cli-command-1767027390790
  - **Created**: 2025-12-29

### High Priority

- [x] **[HIGH]** Implement SDD Workflow: Specify
  - **Roadmap Phase**: Phase 2 - Spec-Driven Development (SDD)
  - **Roadmap Item**: Specify: Define "What" and "Why" (Requirements, Acceptance Criteria)
  - **Effort**: M
  - **Description**: Standardize how requirements and acceptance criteria are defined in specs/
  - **Acceptance Criteria**:
    - [ ] Template for specs/ created
    - [ ] Validation for SHALL/MUST logic implemented
  - **OpenSpec Change**: add-phase-2-sdd
  - **Created**: 2025-12-29

- [x] **[HIGH]** Implement SDD Workflow: Plan
  - **Roadmap Phase**: Phase 2 - Spec-Driven Development (SDD)
  - **Roadmap Item**: Plan: Define "How" (Architecture, API contracts)
  - **Effort**: M
  - **Description**: Standardize architectural planning before implementation
  - **Acceptance Criteria**:
    - [ ] Template for plans/ created
    - [ ] Embedded Plan Mode support in CLI
  - **OpenSpec Change**: add-phase-2-sdd
  - **Created**: 2025-12-29

- [x] **[HIGH]** Create Multi-Agent SDD Cycle Agent Definitions
  - **Roadmap Phase**: Phase 2 - Spec-Driven Development (SDD)
  - **Roadmap Item**: Agent Definitions: Specialized roles for SDD phases
  - **Effort**: M
  - **Description**: Create agent definitions for Architect, Developer, QA, and Reviewer roles
  - **Acceptance Criteria**:
    - [x] Architect agent definition created in `ai/agents/architect.md`
    - [x] Developer agent definition created in `ai/agents/developer.md`
    - [x] QA agent definition created in `ai/agents/qa.md`
    - [x] Reviewer agent definition created in `ai/agents/reviewer.md`
    - [x] Each definition includes Purpose, Responsibilities, Constraints, Input/Output Contracts, Success Criteria
    - [x] Documentation created in `docs/AGENT_SCOPE.md`
  - **OpenSpec Change**: add-multi-agent-sdd-cycle
  - **Created**: 2025-12-30
  - **Completed**: 2025-12-30

- [x] **[HIGH]** Implement SDD Workflow: Tasks
  - **Roadmap Phase**: Phase 2 - Spec-Driven Development (SDD)
  - **Roadmap Item**: Tasks: Break down plans into executable items
  - **Effort**: S
  - **Description**: Integration of task tracking within the change workflow
  - **Acceptance Criteria**:
    - [ ] `tasks.md` format standardized
    - [ ] Status sync with ROADMAP/BACKLOG
  - **OpenSpec Change**: add-phase-2-sdd
  - **Created**: 2025-12-29

- [x] **[HIGH]** SDD Artifact Infrastructure
  - **Roadmap Phase**: Phase 2 - Spec-Driven Development (SDD)
  - **Roadmap Item**: Standardized directory structure: specs/, plans/, tasks/, contracts/
  - **Effort**: S
  - **Description**: Establish and enforce the standard directory layout for SDD
  - **Acceptance Criteria**:
    - [ ] Directory structure initialized
    - [ ] project.md updated with conventions
  - **OpenSpec Change**: add-phase-2-sdd
  - **Created**: 2025-12-29

### Medium Priority

- [x] **[MEDIUM]** Implement SDD Workflow: Implement
  - **Roadmap Phase**: Phase 2 - Spec-Driven Development (SDD)
  - **Roadmap Item**: Implement: Execute specific tasks with targeted context
  - **Effort**: L
  - **Description**: Logic for executing specific tasks with context isolation
  - **Acceptance Criteria**:
    - [ ] Script for task execution with limited context
    - [ ] Integration with `agent-scope` main loop
  - **OpenSpec Change**: add-phase-2-sdd
  - **Created**: 2025-12-29

- [x] **[MEDIUM]** Embedded Plan Mode
  - **Roadmap Phase**: Phase 2 - Spec-Driven Development (SDD)
  - **Roadmap Item**: Support for Embedded Plan Mode
  - **Effort**: M
  - **Description**: Add support for agents to present a plan for approval before making changes
  - **Acceptance Criteria**:
    - [ ] Interception logic for file mutations
    - [ ] User approval loop implemented
  - **OpenSpec Change**: add-phase-2-sdd
  - **Created**: 2025-12-29

- [x] **[MEDIUM]** OpenSpec Validation Integration
  - **Roadmap Phase**: Phase 2 - Spec-Driven Development (SDD)
  - **Roadmap Item**: OpenSpec validation for API-first development
  - **Effort**: S
  - **Description**: Integrate OpenSpec validation into the default dev workflow
  - **Acceptance Criteria**:
    - [ ] `openspec validate` runs on pre-commit
    - [ ] API-diff tools integrated
  - **OpenSpec Change**: add-phase-2-sdd
  - **Created**: 2025-12-29

### Low Priority

- [ ] **[LOW]** Implement PreToolUse Hook System
  - **Roadmap Phase**: Phase 3 - Execution Engine & Guardrails
  - **Roadmap Item**: PreToolUse: Intercept and block dangerous commands or sensitive file access
  - **Effort**: M
  - **Description**: As a developer, I want PreToolUse hooks to intercept dangerous commands, so that agents cannot perform unsafe operations
  - **Acceptance Criteria**:
    - [ ] Hook system architecture defined
    - [ ] Command interception logic implemented
    - [ ] Dangerous command patterns identified and blocked
  - **Dependencies**: Phase 2 SDD implementation
  - **OpenSpec Change**: implement-pretooluse-hook-system
  - **Created**: 2025-12-29

- [ ] **[LOW]** Implement Context Isolation for Subagents
  - **Roadmap Phase**: Phase 4 - Advanced Context Engineering
  - **Roadmap Item**: Subagent Sandboxing: Execute specialized subtasks in completely isolated contexts
  - **Effort**: L
  - **Description**: As a developer, I want subagent context isolation, so that specialized subtasks don't interfere with each other
  - **Acceptance Criteria**:
    - [ ] Subagent sandboxing architecture designed
    - [ ] Context isolation mechanisms implemented
    - [ ] Subtask execution boundaries enforced
  - **Dependencies**: Phase 3 Hook System
  - **OpenSpec Change**: implement-context-isolation-for-subagents
  - **Created**: 2025-12-29

- [ ] **[LOW]** Implement CLI Diagnostics Commands
  - **Roadmap Phase**: Phase 5 - Developer Tooling (IDE)
  - **Roadmap Item**: agent-scope explain [agent|plan|flow]
  - **Effort**: M
  - **Description**: As a developer, I want CLI diagnostic commands, so that I can understand agent behavior and troubleshoot issues
  - **Acceptance Criteria**:
    - [ ] `agent-scope explain` command implemented
    - [ ] Agent behavior visualization added
    - [ ] Flow analysis and reporting features
  - **Dependencies**: Phase 4 Context Engineering
  - **OpenSpec Change**: implement-cli-diagnostics-commands
  - **Created**: 2025-12-29

- [ ] **[LOW]** Prepare NPM Package Publication
  - **Roadmap Phase**: Phase 5 — Distribution & Ecosystem
  - **Roadmap Item**: NPM package publication
  - **Effort**: S
  - **Description**: As a user, I want to install agent-scope via NPM, so that I can easily use it in my projects
  - **Acceptance Criteria**:
    - [ ] Package.json configured for publication
    - [ ] Build and distribution pipeline setup
    - [ ] NPM publishing workflow automated
  - **Dependencies**: Phase 5 IDE Integration
  - **OpenSpec Change**: prepare-npm-package-publication
  - **Created**: 2025-12-29

---

## Bugs and Technical Debt

---

## Completed
