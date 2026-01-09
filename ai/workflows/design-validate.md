# Workflow: Validate Overall Design

## Purpose

Ensure `architecture/DESIGN.md` is structurally correct, aligns with business requirements, and provides a stable foundation for feature design.

## Prerequisites

- `architecture/BUSINESS.md` must be validated.
- `architecture/DESIGN.md` must exist.

## Steps

### 1. Structural Validation

Verify that the following sections are present:

- [ ] **Section A**: Architecture Overview
- [ ] **Section B**: Requirements & Principles
- [ ] **Section C**: Technical Architecture
- [ ] **Section D**: Additional Context

### 2. Business Alignment Check

- [ ] Verify that all system layers in Section A support at least one capability from `BUSINESS.md`.
- [ ] Verify that all actors from `BUSINESS.md` are accounted for in the technical architecture.

### 3. Technical Completeness

- [ ] Verify that **Domain Model** (@DomainModel) contains at least 2 core entities.
- [ ] Verify that **API Contracts** (@API) define at least 2 primary interface points.
- [ ] Ensure no code snippets exist in logic descriptions (Logic Flow only).

### 4. Scoring (90/100 threshold)

Calculate the score based on:

- Structure (25 points): All sections present and correctly formatted.
- Alignment (25 points): Direct mapping to business capabilities.
- Completeness (25 points): Domain model and API contracts are specific and usable.
- Logic Flow Compliance (25 points): No code in design sections.

## Success Criteria

- Validated structure.
- Score ≥ 90/100.
- 0 code snippets in design sections.

## Failure Result

If validation fails, the agent MUST:

1. Report the score and identifying missing points.
2. Highlight any contradictions with `BUSINESS.md`.
3. Locate any code snippets that must be converted to Logic Flow.
