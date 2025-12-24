# Change: Phase 4 — Developer tooling

## Why

Phase 3 established explicit agent flows with DAG-based definitions and artifact-based context passing. Phase 4 improves usability and developer experience without reducing control or explicitness. Developers need better tools to understand, visualize, and debug agent flows and configurations.

## What Changes

- Add `agent-scope explain` command for interactive flow and configuration explanation
- Add `agent-scope graph` command for ASCII/visual graph rendering of flows and agent relationships
- Improve error messages and diagnostics across all commands
- Create project templates for common agent-flow patterns
- Add standard role and flow presets for rapid setup
- Create OpenSpec templates for specification scaffolding

## Impact

- Affected specs: `cli-commands`, `developer-experience`, `templates`
- Affected code: `src/commands/`, `src/templates/`, `src/utils/`
- New capabilities: explain, graph, templates
- No breaking changes to existing APIs
