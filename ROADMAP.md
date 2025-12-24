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

## Phase 1.5 — Agent execution & IDE integration 

**Goal:** Enable agents to run with isolated contexts and integrate with IDEs.

**Status:** COMPLETE

### Agent execution engine 

- [x] Process-based agent execution with isolated contexts
- [x] Execution state management (pending, running, completed, failed)
- [x] Execution logging and result tracking
- [x] Timeout and cancellation support

### Context isolation 

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

## Phase 3 — Agent flows ✅ COMPLETE

**Goal:** Explicit and verifiable agent interaction.

**Status:** COMPLETE

### Flow definitions ✅

- [x] Directed agent graphs (DAG)
- [x] Explicit input/output relationships
- [x] Flow correctness validation
- [x] JSON parser and serialization
- [x] Cycle detection algorithm

### Artifact management ✅

- [x] Artifact lifecycle tracking (created, used, archived)
- [x] Ownership-based access control
- [x] In-memory artifact storage

### Context handoff ✅

- [x] Artifact-based context passing
- [x] No implicit global context
- [x] Clear ownership of produced artifacts
- [x] Context isolation per agent
- [x] Context validation

### CLI commands ✅

- [x] `agent-scope flow validate` - Validate flow definitions
- [x] `agent-scope flow show` - Display flow details
- [x] `agent-scope flow graph` - Visualize flow structure

### Testing & quality ✅

- [x] 56 comprehensive tests (198 total)
- [x] 86% statement coverage, 82% branch coverage
- [x] All metrics above 80% minimum threshold
- [x] ESLint compliance
- [x] TypeScript strict mode

---

## Phase 4 — Developer tooling ✅ COMPLETE

**Goal:** Improve developer experience with better tools for understanding and debugging flows.

**Status:** Completed Dec 24, 2025

### CLI commands ✅

- [x] `agent-scope explain flow` - Display flow overview, nodes, edges
- [x] `agent-scope explain agent` - Display agent details and capabilities
- [x] `agent-scope explain role` - Display role details and agents
- [x] `agent-scope graph flow` - ASCII and JSON flow visualization
- [x] `agent-scope graph agents` - Agent relationship graph with role filtering
- [x] `agent-scope graph dependencies` - Dependency graph with depth control

### Diagnostics ✅

- [x] Enhanced error messages with context and suggestions
- [x] Validation error details with remediation hints
- [x] Error formatter utility with quiet mode

### Templates & Presets ✅

- [x] Project templates (basic-flow, multi-agent)
- [x] Role presets (developer, qa, architect, reviewer)
- [x] Flow presets (sequential, parallel)
- [x] Template manager for scaffolding
- [x] Preset manager for loading

### Testing & quality ✅

- [x] 60+ unit tests (246 total passing)
- [x] Integration tests for all commands
- [x] Error formatter tests
- [x] Template and preset tests

---

## Phase 5 — Execution adapters (optional)

**Goal:** Enable execution while keeping the core model-agnostic.

> Execution is intentionally not part of the core.

- [ ] Local execution adapters
- [ ] Remote / API-based execution adapters
- [ ] CI-friendly non-interactive mode

---

## Phase 6 — Build system

**Goal:** Build system for agents and flows.

> CLI commands

- [ ] `agent-scope build`
- [ ] `agent-scope validate`

> Build system

- [ ] Create npm package
- [ ] Add build scripts
- [ ] Add release process
- [ ] Publish on npm registry

> Github pages

- [ ] Add documentation

> CI pipeline

- [ ] Add CI pipeline
- [ ] Add release process
