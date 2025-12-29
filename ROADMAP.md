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

- [ ] Repository structure (`src/`, `bin/`, `tests/`, `docs/`)
- [ ] CLI entry point with command routing (help, version)
- [ ] TypeScript configuration with strict compiler options
- [ ] Testing framework with coverage baseline
- [ ] Initial documentation (`README.md`, `ROADMAP.md`, `CONTRIBUTING.md`)
- [ ] CI pipeline (tests, lint, typecheck, pre-commit hooks)

---

## Phase 1 — Agent Memory & Skills

**Goal:** Define stable primitives for agents and reusable instructions.

### AI Agents & Roles

- [ ] AI agent definition (name, role, model, scope)
- [ ] **Agent Memory Blocks:** Support for `AGENTS.md` format (standardized project instructions).
- [ ] Built-in roles: `developer`, `qa`, `architect`, `reviewer`.

### Reusable Skills (3-Level Architecture)

- [ ] **Level 1 (Metadata):** YAML frontmatter loaded at startup (~100 tokens).
- [ ] **Level 2 (Instructions):** Markdown-based instructions loaded only when triggered.
- [ ] **Level 3 (Resources):** External code/docs loaded into context as needed.

### CLI Commands

- [ ] `agent-scope init`
- [ ] `agent-scope agent add/list`
- [ ] `agent-scope skill add`

---

## Phase 2 — Spec-Driven Development (SDD)

**Goal:** Move from "Vibe Coding" to structured AI orchestration.

### Workflow Orchestration

- [ ] **Specify:** Define "What" and "Why" (Requirements, Acceptance Criteria).
- [ ] **Plan:** Define "How" (Architecture, API contracts) without changing code.
- [ ] **Tasks:** Break down plans into isolated, executable todo-list items.
- [ ] **Implement:** Execute specific tasks with targeted context.

### Artifact Management

- [ ] Standardized directory structure: `specs/`, `plans/`, `tasks/`, `contracts/`.
- [ ] Support for **Embedded Plan Mode**: Agents must present a plan for approval before mutation.
- [ ] OpenSpec validation for API-first development.

---

## Phase 3 — Execution Engine & Guardrails

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

## Phase 4 — Advanced Context Engineering

**Goal:** Mitigate "Context Rot" and "Task Drift" in complex systems.

### Context Isolation

- [ ] **Subagent Sandboxing:** Execute specialized subtasks in completely isolated contexts.
- [ ] **Domain-Driven Scoping:** Bound an agent’s context strictly to a specific DDD module or Hexagonal layer.
- [ ] **Semantic Ignorance:** Use `.agentignore` to filter noise (logs, build artifacts, sensitive data).

### Structured Knowledge

- [ ] **MCP (Model Context Protocol):** Support for MCP servers to fetch real-time, structured documentation.
- [ ] **Context Burst Prevention:** Automatically summarize large tool outputs (e.g., long test logs).

---

## Phase 5 — Developer Tooling (IDE)

**Goal:** Provide visibility into the agentic "thought" process.

### CLI Diagnostics

- [ ] `agent-scope explain [agent|plan|flow]`
- [ ] `agent-scope graph`: Visualize the DAG of agent interactions.
- [ ] Structured validation errors with remediation hints.

### IDE Integration

- [ ] **VS Code Extension:** Sidebar for task tracking, plan approval, and hook notifications.
- [ ] **JSON-RPC Protocol:** Standardize communication between CLI and IDE plugins.

---

## Phase 6 — Distribution & Ecosystem

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
