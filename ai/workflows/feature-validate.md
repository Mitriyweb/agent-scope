1. Execute [workflows/init-workflow.md](init-workflow.md)

# Workflow: Validate Feature Design

## Purpose

Ensure a feature-level `DESIGN.md` is complete, follows Logic Flow rules, and is ready for implementation.

## Prerequisites

- `architecture/features/FEATURES.md` must be validated.
- The feature's `DESIGN.md` must exist.

## Steps

### 1. Structural Validation (Sections A-G)

Verify all required sections are present:

- [ ] **Section A**: Overview
- [ ] **Section B**: Actor Flows (PRIMARY)
- [ ] **Section C**: Algorithms
- [ ] **Section D**: States
- [ ] **Section E**: Technical Details
- [ ] **Section F**: Requirements
- [ ] **Section G**: Implementation Plan

### 2. Logic Flow and Logic Check

- [ ] Verify that **Section B** (Actor Flows) is complete and covers the main success paths.
- [ ] Ensure **0 code snippets** exist in Sections B and C. All logic must use Logic Flow.

### 3. Reference Validation

- [ ] Verify that all domain types reference @DomainModel from the **Overall Design**.
- [ ] Ensure no types are redefined locally in the feature design.

### 4. Scoring (100/100 required)

- Structure: 20 points
- Actor Flows completeness: 30 points
- Logic Flow Compliance: 20 points
- Reference Integrity: 30 points

## Success Criteria

- Score = 100/100.
- 100% Logic Flow compliance in logic sections.
- 0 type redefinitions.

## Failure Result

If validation fails, the agent MUST:

1. Identify missing sections or incomplete flows.
2. List code snippets that violate Logic Flow rules.
3. Identify types that must be referenced from the Overall Design.
