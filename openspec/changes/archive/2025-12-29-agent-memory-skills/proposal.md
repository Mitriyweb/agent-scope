# Proposal: Agent Memory & Skills

**Change ID**: `agent-memory-skills`

## Why

Implement Phase 1 of the roadmap: define stable primitives for agents (`AGENTS.md`) and reusable skills with a 3-level architecture. This establishes the core "Agent Scope" functionality.

## What Changes

### Capabilities

- **Agent Configuration**: Define `AgentConfig` schema, `Role` enums, and support for `AGENTS.md` (project-level instructions).
- **Skill System**: Implement the 3-level skill architecture (Metadata, Instructions, Resources).
- **CLI Commands**:
  - `agent-scope init`: Initialize `.agent-scope/` directory.
  - `agent-scope agent add`: Add a new agent to configuration.
  - `agent-scope skill add`: Add a new skill.

### Improvements

- Better context management via managed blocks in AGENTS.md.
- Migration logic for existing ai/ and AGENTS.md files.

## Impact

### Affected Specs

- `agents`
- `skills`
- `cli`

### Affected Code

- `src/utils/ConfigLoader.ts`
- `src/utils/SkillLoader.ts`
- `src/commands/*.ts`
- `src/index.ts`
