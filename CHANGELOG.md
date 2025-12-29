# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-29

### Added

- Agent memory and skills (Phase 1)
- `agent-scope init`: Initialize project with `.agent-scope/` and `AGENTS.md`
- `agent-scope agent add/list`: Manage agent configurations in `agents.yaml`
- `agent-scope skill add`: Create reusable skill templates
- Robust `AGENTS.md` merging with managed blocks (`<!-- OPENSPEC:START -->` or `<!-- AGENT-SCOPE:START -->`)
- Automatic migration of legacy `ai/` and `AGENTS.md` files to `.agent-scope/`
- OpenSpec alignment for agent instructions
- Skill architecture with lazy loading support (Level 1 & 2)

## [0.0.1] - 2025-12-24

### Initial Release

- Phase 0 bootstrap: Repository structure and CLI entry point
- Basic CLI with help and version commands
- Project documentation and contribution guidelines
- License and governance files
- OpenSpec integration for specification-driven development
- Repository structure (bin/, src/, tests/, docs/)
- CLI entry point with basic command routing
- Comprehensive documentation (README, ROADMAP, CONTRIBUTING)
- License (MIT) and governance files (CODE_OF_CONDUCT, SECURITY)
- OpenSpec configuration for specification tracking
- Execution adapters for command execution:
  - `ExecutionAdapter` interface with `ExecutionResult` and `ExecutionOptions` types
  - `LocalExecutionAdapter` for executing commands locally using Node.js child_process
  - `RemoteExecutionAdapter` for executing commands on remote endpoints with retry logic
  - `ExecutionStatus` enum for tracking execution states (Pending, Running, Success, Failed, Timeout, Cancelled)
- Comprehensive test coverage for execution adapters (35 test suites, 285 tests total)
