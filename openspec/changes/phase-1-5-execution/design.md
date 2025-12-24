# Phase 1.5 — Agent execution & IDE integration Design

## Context

Phase 1.5 transforms agent-scope from a configuration tool into an execution platform. Agents must run with:

- **Isolated contexts**: Each agent operates within its defined scope without interfering with others
- **Concurrent execution**: Multiple agents run in parallel when safe
- **IDE integration**: Seamless integration with developer tools (VS Code, JetBrains, Neovim)
- **Workflow support**: Sequential and parallel execution patterns
- **State management**: Track agent execution, logs, and results

This phase is critical for enabling real agent orchestration while maintaining security and isolation.

## Goals / Non-Goals

### Goals

- Implement agent execution engine with proper isolation
- Support concurrent execution of multiple agents
- Provide IDE integration for VS Code, JetBrains, Neovim
- Enable workflow orchestration (sequential, parallel, conditional)
- Implement context isolation (filesystem, environment variables, memory)
- Provide execution logging and state tracking
- Support agent-to-agent communication within workflows

### Non-Goals

- Distributed execution across machines (Phase 3+)
- Advanced scheduling or load balancing (Phase 3+)
- Persistent state storage (Phase 3+)
- Real-time monitoring dashboards (Phase 3+)
- Agent marketplace or plugin system (Phase 4+)

## Decisions

### Execution Model

**Decision**: Use process-based isolation for agents with shared parent process for coordination.

**Rationale**:

- Process isolation provides strong security boundaries
- Node.js child processes are lightweight and manageable
- Shared parent process enables inter-agent communication
- Easier to implement than full containerization
- Can upgrade to containers in Phase 3 if needed

### Context Isolation Strategy

**Decision**: Isolate via environment variables, working directory, and filesystem access control.

**Rationale**:

- No external dependencies (containers, VMs)
- Leverages Phase 1 scope definitions
- Works across platforms (Windows, macOS, Linux)
- Can be enhanced in Phase 3

### IDE Integration Approach

**Decision**: Use language-agnostic protocol (JSON-RPC inspired) for IDE communication.

**Rationale**:

- Decouples execution from IDE implementations
- Enables multiple IDE plugins independently
- Supports future IDE additions without core changes
- Clear contract between execution and IDEs

### Workflow Orchestration

**Decision**: Use DAG (Directed Acyclic Graph) model for workflow definitions.

**Rationale**:

- Supports sequential, parallel, and conditional patterns
- Enables cycle detection and validation
- Clear execution semantics
- Proven model in CI/CD systems

## Risks / Trade-offs

### Risk: Process isolation may not be sufficient for untrusted agents

**Mitigation**: Document security model, add container support in Phase 3 if needed.

### Risk: IDE protocol complexity

**Mitigation**: Start with simple protocol, add features incrementally based on IDE feedback.

### Risk: Workflow DAG may be too restrictive

**Mitigation**: Support conditional execution and dynamic workflows in Phase 3.

## Open Questions

- Should agents be able to modify each other's context?
- How should agent failures affect dependent agents in a workflow?
- Should there be a timeout mechanism for long-running agents?
