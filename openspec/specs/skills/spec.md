# skills Specification

## Purpose

TBD - created by archiving change agent-memory-skills. Update Purpose after archive.

## Requirements

### Requirement: Skill Architecture

Skills SHALL follow a 3-level architecture to optimize context usage.

#### Scenario: Verify Skill Levels

- **WHEN** a skill is loaded
- **THEN** it SHALL support 3 distinct levels:
  - **Level 1 (Metadata)**: Small YAML frontmatter (~100 tokens)
  - **Level 2 (Instructions)**: Full markdown content loaded on demand
  - **Level 3 (Resources)**: External files or code referenced by instructions

### Requirement: Lazy Loading

Skills SHALL be lazy-loaded to prevent context pollution.

#### Scenario: Load Metadata Only

- **WHEN** the application starts
- **THEN** only Level 1 (Metadata) of skills SHALL be loaded into memory
- **AND** Level 2 (Instructions) SHALL NOT be loaded until the skill is explicitly triggered
