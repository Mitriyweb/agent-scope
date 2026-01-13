---
description: Implement a feature from the roadmap or backlog using OpenSpec.
---

1. Execute [workflows/init-workflow.md](init-workflow.md)

# Implement Feature Workflow

Use this workflow to implement a specific feature identified by name or number from the roadmap or backlog.

## Prerequisites

- Access to `ROADMAP.md` and `BACKLOG.md`.
- `openspec` CLI installed and configured.

## Steps

### 1. Research & Identification

- Locate the requested feature in `ROADMAP.md` or `BACKLOG.md`.
- Verify the feature's status and any existing dependencies or context.
- Identify the appropriate `change-id` for the OpenSpec proposal (use the name or ID provided).

### 2. Create OpenSpec Proposal

// turbo

- Run `/openspec-proposal` for the identified feature.
- Ensure the proposal includes:
  - Clear requirements and scenarios.
  - Updated or new specifications in `openspec/specs/`.
  - A detailed `tasks.md` that includes updates to tests, documentation, and project tracking files.

### 3. Implement & Verify

// turbo

- Once the proposal is approved, run `/openspec-apply` to start implementation.
- **Mandatory Completion Requirements**:
  1. **Feature Implementation**: Write the core logic as defined in the spec.
  2. **Test Updates**: Add or update tests to verify the new feature. Ensure all tests pass.
  3. **Documentation**: Update user guides, README, or other relevant docs to reflect changes.
  4. **Roadmap Update**: Mark the feature as complete in `ROADMAP.md`.
  5. **Backlog Update**: Mark the task as complete in `BACKLOG.md`.
  6. **Version Bump**: Increment the version in `package.json` appropriately (PATCH for small features/fix, MINOR for significant new features).

### 4. Archive & Final Review

// turbo

- Run `/openspec-archive` for the completed `change-id`.
- Run `openspec validate --strict` to ensure the final state of the repository is correct.
- Verify that all `tasks.md` items are marked as done.
- Final commit includes:
  - Implemented features/tests/docs.
  - Updated `ROADMAP.md` and `BACKLOG.md`.
  - Updated `package.json` (version bump).
  - Archived OpenSpec change and updated specs.
