# Spec Delta: Architecture Consistency Checks

## ADDED Requirements

### Requirement: [CONS-001] Type Collision Prevention

Feature designs SHALL reference types defined in `@DomainModel` in the Overall Design and MUST NOT redefine them locally.

#### Scenario: Redefinition Failure

- **GIVEN**: An overall design defines `@DomainModel.User`.
- **WHEN**: A feature design defines a local `User` type instead of referencing the overall design.
- **THEN**: Validation SHALL fail with a "Type Redefinition" error.

### Requirement: [CONS-002] Logic Flow Compliance Gate

All logic sections (`Section B`, `Section C`) MUST NOT contain programming-specific syntax (e.g., curly braces, semicolons).

#### Scenario: Code Detection

- **GIVEN**: A feature design contains a code snippet `user.save();` in Section B.
- **WHEN**: `feature-validate` is executed.
- **THEN**: The score MUST be reduced and validation SHALL report a Logic Flow violation.
