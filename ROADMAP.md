# agent-scope Roadmap

This document tracks the planned work for **agent-scope** — a CLI tool for configuring, orchestrating, and executing **AI agents** with explicit roles, scoped context, and OpenSpec-compatible specifications.

This roadmap has been updated to reflect modern **Context Engineering** and **Spec-Driven Development (SDD)** practices.

---

## Principles

- **Context Engineering over Prompt Engineering:** Dynamically managing tokens is the core challenge.
- **Spec-Driven Development (SDD):** No implementation without a specification and a plan.
- **Explicit Context Isolation:** Use subagents to prevent "Context Rot" and "Task Drift."
- **Engineering Guardrails:** Automated validation (ArchUnit, API-diff, Linters) is mandatory.
- **OpenSpec as Truth:** Specifications define the contract between agents.

---

## Phase 0 — Project Bootstrap

**Goal:** Prepare the repository and core infrastructure.

- [x] Repository structure (`src/`, `bin/`, `tests/`, `docs/`)
- [x] CLI entry point with command routing (help, version)
- [x] TypeScript configuration with strict compiler options
- [x] Testing framework with coverage baseline
- [x] Initial documentation (`README.md`, `ROADMAP.md`, `CONTRIBUTING.md`)
- [x] CI pipeline (tests, lint, typecheck, pre-commit hooks)

---

## Phase 1 — Agent Memory & Skills

**Goal:** Define stable primitives for agents and reusable instructions.

### AI Agents & Roles

- [x] AI agent definition (name, role, model, scope)
- [x] **Agent Memory Blocks:** Support for `AGENTS.md` format (standardized project instructions).
- [x] Built-in roles: `developer`, `qa`, `architect`, `reviewer`.

### Reusable Skills (3-Level Architecture)

- [x] **Level 1 (Metadata):** YAML frontmatter loaded at startup (~100 tokens).
- [x] **Level 2 (Instructions):** Markdown-based instructions loaded only when triggered.
- [ ] **Level 3 (Resources):** External code/docs loaded into context as needed.

### CLI Commands

- [x] `agent-scope init`
- [x] `agent-scope agent add/list`
- [x] `agent-scope skill add`

---

## Phase 2 — Spec-Driven Development (SDD)

**Goal:** Move from "Vibe Coding" to structured AI orchestration.

### Workflow Orchestration

- [x] **Specify:** Define "What" and "Why" (Requirements, Acceptance Criteria).
- [x] **Plan:** Define "How" (Architecture, API contracts) without changing code.
- [x] **Tasks:** Break down plans into isolated, executable todo-list items.
- [x] **Implement:** Execute specific tasks with targeted context.

### Multi-Agent SDD Cycle

- [x] **Agent Definitions:** Specialized roles for SDD phases (Architect, Developer, QA, Reviewer)
- [x] **Agent Templates:** Structured definitions in `ai/agents/` with clear responsibilities and contracts
- [ ] **Workflow Definitions:** Configurable agent sequences with approval gates
- [ ] **Dependency Tracking:** System tracks which workflows use which agents
- [ ] **Template Build System:** Copy agent/workflow templates to dist/ for distribution

### Artifact Management

- [x] Standardized directory structure: `specs/`, `plans/`, `tasks/`, `contracts/`.
- [x] Support for **Embedded Plan Mode**: Agents must present a plan for approval before mutation.
- [x] OpenSpec validation for API-first development.

---

## Phase 3 — Enhanced Specification & Design System

**Goal:** Strengthen design documentation and validation to support multi-agent SDD workflows (Logic Flow-inspired).

### Algorithm Specifications

- [/] **Pseudocode Format:** Support structured, numbered pseudocode (Logic Flow) in specifications for complex logic
- [ ] **Language-Agnostic Descriptions:** Enable algorithm documentation readable by non-programmers
- [x] **Agent Guidelines:** Add `ai/rules/algorithm-specs.md` for agents writing logic descriptions
- [ ] **Reviewer Accessibility:** Allow `reviewer` agents to validate logic without code knowledge

### Hierarchical Design Documents

- [x] **Business Context Layer:** Establish `architecture/BUSINESS.md` for high-level vision and actors
- [x] **System Architecture:** Establish `architecture/DESIGN.md` for overall architecture and domain model
- [x] **Feature Blueprints:** Create `architecture/features/{feature-name}/` for feature-specific designs
- [ ] **Visual Documentation:** Support diagrams in `architecture/diagrams/` (Mermaid, architecture charts)
- [x] **Features Manifest:** Track all capabilities in `architecture/features/FEATURES.md`

### Command Interface Contracts

- [ ] **CLI Contract Specs:** Define formal contracts for `agent-scope` commands in `specs/commands/`
- [ ] **Behavior Validation:** Automated validation that CLI matches its specification
- [ ] **Agent-Readable Specs:** Command specs in YAML/JSON format agents can parse
- [ ] **Contract-First Development:** Commands specified before implementation

### Architecture Validation (Logic Flow-Style)

- [x] **Validation Workflows:** Create `ai/workflows/` for business, design, and feature validation
- [ ] **Consistency Checks:** Automated verification between system and feature designs
- [ ] **Completeness Gates:** Ensure all features have corresponding architecture documentation
- [ ] **Scoring System:** Implement validation scoring (90/100 threshold for design)
- [ ] **Multi-Agent Review:** Architecture validation by `architect` → `reviewer` agent handoff

### Project-Specific Customization

- [ ] **Template Framework:** Support for project templates in `templates/{language}/`
- [ ] **Custom Agent Definitions:** Allow projects to extend standard agent roles
- [ ] **Workflow Extensions:** Enable custom workflows in `.agent/workflows/`
- [ ] **Template Distribution:** Package and share templates across projects

---

## Phase 4 — Execution Engine & Guardrails

**Goal:** Execute agents with strict safety and quality checks.

### The Hook System

- [ ] `PreToolUse`: Intercept and block dangerous commands or sensitive file access.
- [ ] `PostToolUse`: Automatically run formatting, tests, or logging after an action.
- [ ] `SubagentStop`: Summarize subtask results for the parent agent.

### Guardrails (AI Contracts)

- [ ] **Architectural Guardrails:** Integration with `ArchUnit` (Java), `ts-arch` (TS), or `dependency-cruiser`.
- [ ] **API Guardrails:** Integrated `oasdiff` to detect breaking changes in OpenAPI specs.
- [ ] **Static Analysis:** Mandatory linting and security scans on agent-generated code.

---

## Phase 5 — Advanced Context Engineering

**Goal:** Mitigate "Context Rot" and "Task Drift" in complex systems.

### Context Isolation

- [ ] **Subagent Sandboxing:** Execute specialized subtasks in completely isolated contexts.
- [ ] **Domain-Driven Scoping:** Bound an agent's context strictly to a specific DDD module or Hexagonal layer.
- [ ] **Semantic Ignorance:** Use `.agentignore` to filter noise (logs, build artifacts, sensitive data).

### Structured Knowledge

- [ ] **MCP (Model Context Protocol):** Support for MCP servers to fetch real-time, structured documentation.
- [ ] **Context Burst Prevention:** Automatically summarize large tool outputs (e.g., long test logs).

---

## Phase 6 — Developer Tooling (IDE)

**Goal:** Integrate with development environments and provide enhanced tooling.

### Development Environment Setup

- [x] **Environment Detection & Selection:** During `agent-scope init`, prompt user to select their preferred development environment
- [x] **IDE Configuration Templates:** Maintain IDE-specific configuration templates for popular editors
  - [x] VS Code (settings.json, extensions.json, launch.json, tasks.json)
  - [x] Kiro IDE (project settings, agent configurations)
  - [x] Cursor (AI-powered IDE configuration)
  - [x] JetBrains IDEs (WebStorm, IntelliJ IDEA, PyCharm) - .idea/ folder structure
  - [x] Sublime Text (project settings, build systems)
  - [x] Atom (build configuration, legacy support)
  - [x] Vim/Neovim (.vimrc, init.lua, plugin configurations)
  - [x] Emacs (.emacs.d/, init.el configurations)
  - [x] Nova (Panic Nova editor configuration)
  - [x] Brackets (Adobe Brackets editor configuration)
- [x] **AI Tools Integration:** Support for popular AI development tools
  - [x] **Windsurf:** Creates `.windsurf/` directory with copies of `.agent/` content (agents, rules, workflows)
  - [x] **Universal AGENTS.md:** Creates `.agent/` directory for any AI tool supporting AGENTS.md format
  - [x] Simplified setup: Only Windsurf and Universal AGENTS.md available during init
  - [x] `.agent/` directory created only when Universal AGENTS.md is selected
  - [x] Windsurf receives full agent scope context (agents/, rules/, workflows/)
- [x] **Automatic Configuration Copy:** Copy selected IDE and AI tool configurations to project during initialization
- [x] **Multi-Environment Support:** Allow selection of multiple IDEs and AI tools for team environments
- [x] **Configuration Validation:** Verify copied configurations are valid for the target environment
- [x] **Update Command:** `agent-scope env update` to refresh all environment configurations after template changes

### IDE Integration

- [ ] **VS Code Extension:** Sidebar for task tracking, plan approval, and hook notifications.
- [ ] **JSON-RPC Protocol:** Standardize communication between CLI and IDE plugins.
- [ ] **IDE-Specific Plugins:** Support for popular development environments beyond VS Code

---

## Phase 7 — Distribution & Ecosystem

**Goal:** Make agent-scope production-ready.

- [ ] NPM package publication.
- [ ] Public documentation site (e.g., Docusaurus/GitBook).
- [ ] Skill Template Library: Pre-configured skills for React, FastAPI, SQL optimization, etc.
- [ ] CI release automation.

---

## Non-goals

- **Non-AI agents:** Humans are users/approvers, not "agents" in this scope.
- **Implicit "Magic":** No heuristic behavior; everything must be traceably specified.
- **Model-Specific Logic:** Maintain provider-agnostic core logic.

---

## Long-term Vision

**agent-scope** is the infrastructure layer for **Level 3 Agentic Development**.
It transforms the developer from a coder into an **Agent Manager** who governs AI behavior through explicit contracts, domain boundaries, and rigorous engineering guardrails.

**Not a chatbot. Not a framework. A control plane.**
