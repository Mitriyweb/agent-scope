# Workflow: Validate Features Manifest

## Purpose

Ensure `architecture/features/FEATURES.md` correctly decomposes the overall design and maintains valid dependency relationships.

## Prerequisites

- `architecture/DESIGN.md` must be validated.
- `architecture/features/FEATURES.md` must exist.

## Steps

### 1. Structural Validation

Verify that the following are present:

- [ ] Feature list table with Slug, Feature Name, Status, and Dependencies.
- [ ] Dependency graph (Mermaid).

### 2. Design Coverage Check

- [ ] Verify that every primary capability or component mentioned in `DESIGN.md` is covered by at least one feature in the manifest.

### 3. Dependency Validation

- [ ] Verify that all slugs in the "Dependencies" column exist in the feature list.
- [ ] Ensure there are no circular dependencies in the graph.

## Success Criteria

- Validated structure.
- 100% coverage of `DESIGN.md` capabilities.
- 0 circular dependencies.

## Failure Result

If validation fails, the agent MUST:

1. List missing features required for full design coverage.
2. Identify broken or circular dependency links.
