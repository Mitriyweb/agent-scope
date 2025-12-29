# Design: Phase 2 — Spec-Driven Development (SDD)

## Architecture Overview

Spec-Driven Development (SDD) in `agent-scope` transitions the tool from simple agent management to high-fidelity AI orchestration. The core idea is to enforce a "Spec First" rule where no code is changed without an approved specification and a validated plan.

### Core Workflows

1. **Specify**: Translates user requirements into normative system behavior (SHALL/MUST) and concrete scenarios.
2. **Plan**: Bridges requirements and implementation by defining the technical strategy, API changes, and data structures.
3. **Task**: Decomposes plans into atomic, verifiable units of work.
4. **Implement**: Executes tasks using targeted context (only relevant specs and code).

## Component Design

### 1. Artifact Manager

A new internal module responsible for managing the lifecycle of SDD artifacts.

- Handles directory creation and naming conventions.
- Navigates between `specs/`, `plans/`, and `tasks/`.
- Ensures consistency between artifacts (e.g., tasks must reference a plan).

### 2. Orchestration Commands

New CLI commands to support the SDD lifecycle:

- `agent-scope specify <feature-name>`: Scaffolds a new specification.
- `agent-scope plan <spec-id>`: Scaffolds a technical design for a spec.
- `agent-scope task add/list`: Manages the implementation tasks.

### 3. Embedded Plan Mode

A mode where the agent must output its plan to a dedicated file and wait for user confirmation (or automated check) before executing any `write_to_file` or `replace_file_content` calls.

## Data Models

### Backlog Item

```json
{
  "title": string,
  "phase": string,
  "roadmap_item": string,
  "priority": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "effort": "XS" | "S" | "M" | "L" | "XL",
  "description": string,
  "acceptance_criteria": string[],
  "created_at": string
}
```

## Security & Guardrails

- **Plan Validation**: Automatically check if the plan covers all acceptance criteria.
- **Context Isolation**: During the `Implement` phase, the agent should only be allowed to see the specific task and related files to prevent "Context Rot".

## Integration with OpenSpec

The existing `openspec` CLI will be used for:

- Validating the format of specs (SHALL/MUST, scenarios).
- Tracking deltas in requirements.
- Archiving completed changes.
