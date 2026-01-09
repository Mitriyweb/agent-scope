# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2025-12-30

### Added

- Multi-agent SDD cycle infrastructure
- Agent definitions for specialized roles: Architect, Developer, QA, Reviewer
- Agent definition files in `ai/agents/` directory with structured templates
- `OpenSpecDetector` utility for detecting OpenSpec CLI availability
- `AgentDependencyAnalyzer` for tracking agent usage in workflows
- Comprehensive agent-scope documentation in `docs/AGENT_SCOPE.md`
- Multi-agent SDD cycle section in README.md
- Agent role definitions with clear responsibilities, constraints, input/output contracts, and success criteria
- TypeScript types and enums for agent-scope commands (`AgentScope.ts`)

### Changed

- Updated ROADMAP.md to reflect Phase 2 completion
- Updated BACKLOG.md with completed multi-agent tasks
- Bumped version to 0.4.0

### Technical

- Test coverage: 96.98% (107 tests passing)
- All TypeScript strict type checking passing
- No `any` types in production or test code

## [0.1.0] - 2025-12-29

### Features

- Agent memory and skills (Phase 1)
- `agent-scope init`: Initialize project with `.agent/` and `AGENTS.md`
- `agent-scope agent add/list`: Manage agent configurations in `agents.yaml`
- `agent-scope skill add`: Create reusable skill templates
- Robust `AGENTS.md` merging with managed blocks (`<!-- OPENSPEC:START -->` or `<!-- AGENT-SCOPE:START -->`)
- Automatic migration of legacy `ai/` and `AGENTS.md` files to `.agent/`
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
