# Tasks: Agent Memory & Skills

- [x] 1. Core Types & Constants
  - [x] 1.1 Define `Role` enum (developer, qa, spec, reviewer, unknown) in `src/enums/Role.ts`
  - [x] 1.2 Define `AgentConfig` interface (name, role, description, scope, model) in `src/types/AgentConfig.ts`
  - [x] 1.3 Define `Skill` interface (metadata, content, path) in `src/types/Skill.ts`
  - [x] 1.4 Validate types exist and compile

- [x] 2. Agent Configuration System
  - [x] 2.1 Implement `ConfigLoader` to read/write `.agent-scope/agents.yaml`
  - [x] 2.2 Implement `AGENTS.md` parser to extract agent instructions
  - [x] 2.3 Implement tests for ConfigLoader and AGENTS.md parsing

- [x] 3. Skill System
  - [x] 3.1 Implement `SkillLoader` to read markdown files with YAML frontmatter
  - [x] 3.2 Implement logic to parse "Level 1" metadata (lazy loading)
  - [x] 3.3 Implement tests for SkillLoader

- [x] 4. CLI Commands
  - [x] 4.1 Implement `agent-scope init` command (creates `.agent-scope/`, `AGENTS.md`)
  - [x] 4.2 Implement `agent-scope agent list` command
  - [x] 4.3 Implement `agent-scope agent add` command
  - [x] 4.4 Implement `agent-scope skill add` command
  - [x] 4.5 Register new commands in `bin/agent-scope`
  - [x] 4.6 Implement tests for all commands
