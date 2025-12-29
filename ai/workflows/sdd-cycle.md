---
description: Standard development cycle via specifications, planning, and tasks (SDD).
---

# SDD Lifecycle Workflow

This workflow is mandatory for any non-trivial development task.

## 1. Specification Phase (Specify)

Before writing code or even a technical plan, the agent MUST ensure that requirements are formalized.

// turbo

```bash
# If the feature is new:
agent-scope specify <feature_name>
# If the feature already exists, the agent should read it:
agent-scope specify
```

**Completion Criteria:**

- File created or updated in `specs/`.
- `SHALL/MUST` requirements defined.
- Scenarios (WHEN/THEN) for validation described.

## 2. Planning Phase (Plan)

After "What to do" is fixed, the agent proceeds to design "How to do it".

// turbo

```bash
agent-scope plan <change_id>
```

**Completion Criteria:**

- File created in `plans/`.
- Architecture and changes to APIs/contracts described.
- Technical stack and patterns selected.

## 3. Decomposition Phase (Tasks)

The plan is broken down into atomic, verifiable tasks.

// turbo

```bash
# Creating tasks within an OpenSpec proposal
# (Currently manual creation of tasks.md in openspec/changes/<id>/ is used)
agent-scope tasks <change_id>
```

## 4. Implementation Phase (Implement)

Only now does the agent proceed to change the code using **Embedded Plan Mode**.

// turbo

```bash
agent-scope implement <change_id> --plan-first
```

**Completion Criteria:**

- Code written and tested.
- Tests cover scenarios from `specs/`.
- Task list updated (`[x]`).

## Guardrails

- **No Spec, No Code**: Changing business logic without updating the specification is forbidden.
- **Context Isolation**: During implementation, the agent must focus only on the current task.
