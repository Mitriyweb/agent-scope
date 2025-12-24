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

## Phase 0 — Project bootstrap

**Goal:** Prepare the repository and core structure.

- [ ] Repository structure
- [ ] CLI entry point
- [ ] Basic command routing
- [ ] Initial documentation (`README.md`, `roadmap.md`)
- [ ] License and contribution guidelines

---

## Phase 1 — Core configuration (MVP)

**Goal:** Define stable primitives for agents, roles, and context.

### Agents

- [ ] Agent definition (name, role, scope)
- [ ] Agent registry via configuration file
- [ ] Validation of agent definitions

### Roles

- [ ] Built-in standard roles
  - [ ] `developer`
  - [ ] `qa`
  - [ ] `spec`
  - [ ] `reviewer`

- [ ] Custom role definitions
- [ ] Role validation (responsibility, allowed outputs)

### Context (scope)

- [ ] File- and directory-based scoping
- [ ] Read-only vs read-write flags
- [ ] Deterministic scope resolution

### CLI commands

- [ ] `agent-scope init`
- [ ] `agent-scope agent add`
- [ ] `agent-scope agent remove`
- [ ] `agent-scope agent list`
- [ ] `agent-scope role list`
- [ ] `agent-scope validate`

---

## Phase 2 — Specifications & contracts

**Goal:** Make specifications a strict contract between agents.

### OpenSpec support

- [ ] OpenSpec-compatible specification files
- [ ] Schema validation
- [ ] Clear errors on invalid or incomplete specs

### Contract enforcement

- [ ] Require valid OpenSpec input for consuming agents
- [ ] Explicit producer → consumer mapping
- [ ] Fail-fast behavior on contract mismatch

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
