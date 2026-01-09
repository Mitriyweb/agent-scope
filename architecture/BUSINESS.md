# Business Context: agent-scope

## Section A: Vision & Purpose

### Project Vision

`agent-scope` aims to provide the infrastructure layer for **Level 3 Agentic Development**, transforming developers into **Agent Managers** who govern AI behavior through explicit contracts, domain boundaries, and rigorous engineering guardrails.

### Purpose

To solve the common issues in AI-assisted development:

- Responsibility mixing
- Context pollution (Context Rot)
- Focus loss in long-running sessions (Task Drift)

## Section B: Actors

### Human Actors

- **Developer**: Uses the CLI to orchestrate agents and implement tasks.
- **Architect**: Defines the system structure, design principles, and agent roles.
- **Product Owner**: Reviews business alignment and capabilities.

### AI Agents (Roles)

- **Architect agent**: Creates technical designs and system architecture.
- **Developer agent**: Implements and modifies production code.
- **QA agent**: Writes and validates tests.
- **Reviewer agent**: Reviews code and specs for consistency and correctness.

### External Systems

- **OpenSpec CLI**: Used for specification validation and management.
- **IDE (VS Code, Windsurf, etc.)**: The development environment where agent-scope operates.

## Section C: Capabilities

### 1. Agent Configuration & Management

- Declarative agent definitions with explicit roles and scopes.
- Lifecycle management (init, add, list).

### 2. Context Engineering

- Strict directory/file-based context isolation.
- Deliberate context handoff between agents.

### 3. Spec-Driven Development (SDD)

- Built-in workflows for Specify → Plan → Tasks → Implement cycle.
- OpenSpec-compatible artifact generation and validation.

### 4. Engineering Guardrails

- Automated structure and backlog validation.
- Testing and coverage enforcement.
- Embedded Plan Mode for safety.

## Section D: Additional Context

### Constraints

- Must be CLI-first.
- Must remain model-agnostic.
- Must not use hidden heuristics (no "magic").

### Compliance

- MIT License.
- Strict TypeScript enforcement (no `any`).
