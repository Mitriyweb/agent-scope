# Change: Phase 2.5 — Agent Execution & IDE Integration

## Why

Phase 1 defines agent configuration and roles. Phase 2 adds specification validation. But neither enables actually running agents. Phase 2.5 bridges the gap by implementing the execution engine that allows multiple agents to run concurrently with isolated contexts and IDE integration, enabling real-world workflows.

## What Changes

- Implement agent execution engine with isolated runtime contexts
- Support concurrent execution of multiple agents with proper isolation
- Add IDE integration layer (VS Code, JetBrains, Neovim)
- Implement workflow orchestration for sequential and parallel agent execution
- Add execution state management and logging
- Support agent-to-agent communication within workflows
- Implement context isolation (filesystem, environment, memory)

## Impact

- Affected specs: `agent-execution`, `concurrent-execution`, `ide-integration`, `workflow-orchestration`, `context-isolation`
- Affected code: New modules in `src/execution/`, `src/ide/`, `src/workflows/`
- Enables: Phase 3+ (advanced agent flows, state persistence, monitoring)
- Breaking changes: None (additive to Phase 1 and Phase 2)
