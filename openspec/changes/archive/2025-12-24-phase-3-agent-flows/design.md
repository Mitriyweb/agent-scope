# Phase 3 Design: Agent flows

## Context

Phase 2 established specifications as contracts between individual agents. Phase 3 scales this to multi-agent workflows by:

1. Making agent interaction explicit through DAG definitions
2. Eliminating implicit global context
3. Establishing clear artifact ownership and lifecycle
4. Enabling flow-level correctness validation

## Goals / Non-Goals

### Goals

- Enable explicit, verifiable multi-agent workflows
- Eliminate implicit context sharing
- Validate flow correctness before execution
- Support complex patterns (fan-out, fan-in, conditional)
- Provide clear artifact ownership semantics

### Non-Goals

- Real-time flow execution (Phase 4)
- IDE integration (Phase 4)
- Advanced scheduling or resource management (Phase 5+)

## Decisions

### Decision: DAG-based flow model

- Flows are directed acyclic graphs of agents
- Nodes are agents, edges are artifact dependencies
- Rationale: DAGs are well-understood, enable cycle detection, support common patterns
- Alternatives: State machines (too rigid), event-driven (implicit ordering)

### Decision: Artifact-based context passing

- Agents pass artifacts (files, JSON, structured data) explicitly
- No global context or implicit state sharing
- Rationale: Explicit dependencies enable validation, testing, and composition
- Alternatives: Shared context (implicit, hard to validate), message queues (adds complexity)

### Decision: Ownership and lifecycle tracking

- Each artifact has an owner (the agent that produced it)
- Artifacts have lifecycle: created, used, archived
- Rationale: Prevents accidental overwrites, enables cleanup, clarifies responsibility
- Alternatives: Shared ownership (ambiguous), no tracking (error-prone)

## Risks / Trade-offs

### Risk: DAG complexity for advanced patterns

- Mitigation: Start with simple patterns, add conditional/loop support in Phase 4

### Risk: Artifact storage overhead

- Mitigation: Use lazy evaluation, cleanup policies, optional compression

### Risk: Validation strictness vs flexibility

- Mitigation: Provide escape hatches (unsafe mode) but default to strict

## Migration Plan

1. Implement core flow types and validation
2. Add CLI commands for flow inspection
3. Integrate with Phase 2 specifications
4. Add comprehensive tests
5. Document flow patterns and best practices

## Open Questions

- Should flows support conditional execution (if/else)?
- Should flows support loops or only DAGs?
- How to handle long-running artifacts (cleanup policy)?
- Should flows be versioned separately from agents?
