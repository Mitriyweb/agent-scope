# Workflow: Validate Business Context

## Purpose

Validate that `architecture/BUSINESS.md` is complete, structurally sound, and provides sufficient context for design.

## Prerequisites

- `architecture/BUSINESS.md` must exist.

## Steps

### 1. Structural Validation

Verify that the following sections are present:

- [ ] **Section A**: Vision & Purpose
- [ ] **Section B**: Actors
- [ ] **Section C**: Capabilities
- [ ] **Section D**: Additional Context

### 2. Completeness Check

- [ ] Ensure **Section A** contains a clear project vision.
- [ ] Ensure **Section B** identifies both Human Actors and AI Agent roles.
- [ ] Ensure **Section C** list includes at least 3 core system capabilities.
- [ ] Verify there are no "TODO" or "PLACEHOLDER" markers in the document.

### 3. Consistency Check

- [ ] Verify that actors mentioned in Section B are referenced in Section C or Section A.

## Success Criteria

- All sections present.
- No placeholders.
- Minimum 3 capabilities defined.

## Failure Result

If validation fails, the agent MUST:

1. List missing or incomplete sections.
2. Identify specific placeholders or vague descriptions.
3. Suggest improvements to meet validation gates.
