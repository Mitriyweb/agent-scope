# Phase 2.5 — Agent Execution & IDE Integration Design

## Context

Phase 2.5 transforms agent-scope from a configuration tool into an execution platform. Agents must run with:

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

**Architecture**:

```text
Main Process (Orchestrator)
├── Agent Process 1 (isolated context)
├── Agent Process 2 (isolated context)
└── Agent Process N (isolated context)
```

### Context Isolation

**Decision**: Implement isolation through environment variables, working directory, and filesystem access control.

**Rationale**:

- Leverages OS-level mechanisms
- No external dependencies required
- Scope definitions from Phase 1 directly map to filesystem access
- Read-only flags enforced at process level

**Isolation Layers**:

- **Filesystem**: Chroot-like restrictions using scope patterns
- **Environment**: Isolated env vars per agent
- **Working Directory**: Agent-specific temp directories
- **Memory**: Separate Node.js process heap

### IDE Integration

**Decision**: Implement IDE adapters as language-agnostic protocol handlers (LSP-inspired).

**Rationale**:

- LSP model proven for IDE integration
- Extensible to multiple IDEs
- Decouples agent-scope from IDE specifics
- Enables future IDE support without core changes

**Supported IDEs (Phase 2.5)**:

- VS Code (via extension)
- JetBrains (via plugin)
- Neovim (via plugin)

### Workflow Orchestration

**Decision**: Use DAG (Directed Acyclic Graph) model for workflows with sequential and parallel execution.

**Rationale**:

- DAG model is well-understood and proven
- Supports both sequential and parallel patterns
- Enables conditional execution
- Clear dependency tracking

**Workflow Types**:

- **Sequential**: Agent A → Agent B → Agent C
- **Parallel**: Agent A, B, C run simultaneously
- **Conditional**: Agent A runs if condition met, then Agent B
- **Fan-out/Fan-in**: One agent triggers multiple, wait for all

## Risks / Trade-offs

### Risk: Process isolation overhead

**Mitigation**: Use process pooling to reuse processes. Monitor performance and optimize in Phase 3.

### Risk: Inter-process communication complexity

**Mitigation**: Use simple JSON-RPC protocol. Keep communication minimal and asynchronous.

### Risk: IDE integration fragmentation

**Mitigation**: Define clear protocol. Provide reference implementations for each IDE.

### Risk: Scope enforcement complexity

**Mitigation**: Start with simple patterns (directory-based). Add glob support incrementally.

## Migration Plan

Phase 2.5 is additive to Phase 1 and Phase 2:

- Phase 1 agents remain valid (no breaking changes)
- Phase 2 specs remain valid
- Phase 2.5 adds execution capabilities on top
- Phase 3 can build on execution infrastructure

## Open Questions

- Should agents share a single Node.js process or each get their own?
- How should agent-to-agent communication work (direct IPC, message queue, shared memory)?
- Should workflows be defined in YAML, JSON, or programmatically?
- How should execution results be persisted (in-memory, file, database)?
- Should IDE integration be built-in or plugin-based?
