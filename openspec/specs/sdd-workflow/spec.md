## ADDED Requirements

### Requirement: Implementation Safety

The `implement` command SHALL verify that a technical plan exists in `plans/` for the given change ID before proceeding.

#### Scenario: Missing plan

- **WHEN** running `agent-scope implement my-change`
- **THEN** output error message if `plans/my-change.md` does not exist

### Requirement: Task Verification

The `implement` command SHALL verify that the specified task (if provided via `--task`) exists in the change's `tasks.md`.

#### Scenario: Invalid task ID

- **WHEN** running `agent-scope implement my-change --task 9.9`
- **THEN** output error message if task `9.9` is not found

### Requirement: Roadmap Formatting Support

The `tasks sync` command SHALL correctly identify items in `ROADMAP.md` even when they are wrapped in bold markdown (e.g., `**Item Name:**`).

#### Scenario: Bold item in roadmap

- **WHEN** `BACKLOG.md` has a completed item for "My Feature"
- **AND** `ROADMAP.md` has `- [ ] **My Feature:** description`
- **THEN** `tasks sync` SHOULD mark the roadmap item as `[x]`

### Requirement: Structure Validation

The `validate structure` command SHALL verify that all mandatory SDD directories are present and contain a `template.md` (where applicable).

#### Scenario: Missing directory

- **WHEN** `specs/` director is missing
- **THEN** `validate structure` MUST fail
