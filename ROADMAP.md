# agent-scope Roadmap

This document tracks the planned and completed work for **agent-scope** — a CLI tool for configuring and orchestrating AI agents with explicit roles, scoped context, and OpenSpec-compatible specifications.

The roadmap is actionable: items can be checked off as they are completed.

---

## Principles

- Explicit over implicit behavior
- Roles and context are always declared
- OpenSpec is the source of truth for specifications
- Configuration is versioned and auditable
- No hidden state, no magic

---

## Phase 0 — Project bootstrap ✅ COMPLETE

**Goal:** Prepare the repository and core structure.

- [x] Repository structure (src/, bin/, tests/, docs/)
- [x] CLI entry point with command routing
- [x] Basic command routing (help, version)
- [x] Initial documentation (README.md, ROADMAP.md, CONTRIBUTING.md, CHANGELOG.md)
- [x] License and contribution guidelines (LICENSE, CODE_OF_CONDUCT.md, SECURITY.md)
- [x] TypeScript configuration with strict compiler options
- [x] Jest testing framework with 100% coverage baseline
- [x] ESLint configuration enforcing project conventions
- [x] Coverage tracking with auto-update on commit
- [x] Pre-commit hooks with validation
- [x] CI pipeline with test and coverage validation

---

## Phase 1 — Core configuration (MVP) ✅ COMPLETE

**Goal:** Define stable primitives for agents, roles, and context.

### Agents

- [x] Agent definition (name, role, scope)
- [x] Agent registry via configuration file
- [x] Validation of agent definitions

### Roles

- [x] Built-in standard roles
  - [x] `developer`
  - [x] `qa`
  - [x] `architect`
  - [x] `reviewer`

- [x] Custom role definitions
- [x] Role validation (responsibility, allowed outputs)

### Context (scope)

- [x] File- and directory-based scoping
- [x] Read-only vs read-write flags
- [x] Deterministic scope resolution

### CLI commands

- [x] `agent-scope init`
- [x] `agent-scope agent add`
- [x] `agent-scope agent remove`
- [x] `agent-scope agent list`
- [x] `agent-scope role list`
- [x] `agent-scope validate`

---

## Phase 1.5 — Agent execution & IDE integration ✅

**Goal:** Enable agents to run with isolated contexts and integrate with IDEs.

**Status:** COMPLETE

### Agent execution engine ✅

- [x] Process-based agent execution with isolated contexts
- [x] Execution state management (pending, running, completed, failed)
- [x] Execution logging and result tracking
- [x] Timeout and cancellation support

### Context isolation ✅

- [x] Filesystem isolation based on scope patterns
- [x] Environment variable isolation per agent
- [x] Process-level memory isolation
- [x] Temporary directory isolation

### Concurrent execution ✅

- [x] Parallel agent execution
- [x] Concurrency control and resource limits
- [x] Deadlock detection
- [x] Failure handling in concurrent scenarios

### Workflow orchestration ✅

- [x] DAG-based workflow definitions
- [x] Sequential, parallel, and conditional execution patterns
- [x] Fan-out/fan-in patterns
- [x] Agent-to-agent communication

### IDE integration

- [ ] VS Code extension with agent execution and workflow management
- [ ] JetBrains plugin (IntelliJ, PyCharm, WebStorm)
- [ ] Neovim plugin
- [ ] JSON-RPC protocol for IDE communication
- [ ] Real-time execution updates

---

## Phase 2 — Specifications & contracts ✅

**Goal:** Make specifications a strict contract between agents.

**Status:** COMPLETE

### OpenSpec support ✅

- [x] OpenSpec-compatible specification files
- [x] Schema validation
- [x] Clear errors on invalid or incomplete specs

### Contract enforcement ✅

- [x] Require valid OpenSpec input for consuming agents
- [x] Explicit producer → consumer mapping
- [x] Fail-fast behavior on contract mismatch

---

## Phase 3 — Agent flows

**Goal:** Explicit and verifiable agent interaction.

### Flow definitions

- [ ] Directed agent graphs (DAG)
- [ ] Explicit input/output relationships
- [ ] Flow correctness validation

### Context handoff

- [ ] Artifact-based context passing
- [ ] No implicit global context
- [ ] Clear ownership of produced artifacts

---

## Phase 4 — Developer tooling

**Goal:** Improve usability without reducing control.

### CLI tooling

- [ ] `agent-scope explain`
- [ ] `agent-scope graph`
- [ ] Improved diagnostics and error messages

### Templates

- [ ] Project templates
- [ ] Standard role + flow presets
- [ ] OpenSpec templates

---

## Phase 5 — Execution adapters (optional)

**Goal:** Enable execution while keeping the core model-agnostic.

> Execution is intentionally not part of the core.

- [ ] Local execution adapters
- [ ] Remote / API-based execution adapters
- [ ] CI-friendly non-interactive mode

---

## Phase 6 — Extensibility

**Goal:** Grow an ecosystem without fr
