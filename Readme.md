# agent-scope

CLI tool for configuring and orchestrating AI agents in software projects.

`agent-scope` allows you to define AI agent roles (coder, tester, requirements analyst, etc.), strictly limit their context, and explicitly control how context is passed between agents within a project.

The project is designed for engineering use: predictability, context isolation, reproducibility, and transparency.

---

## Why agent-scope exists

Modern AI agents are only effective when their role and context are clearly defined. Without this, they tend to:

- mix responsibilities (code + tests + requirements in one output)
- pollute context with irrelevant files
- lose focus in long-running sessions

`agent-scope` solves this by introducing **explicit agent configuration**:

- each agent has a **role**
- each agent has a **restricted context (scope)**
- context is **passed between agents deliberately**, not implicitly

---

## Key features

- 📦 CLI tool installed per project
- 🧠 Declarative AI agent configuration
- 🎭 Agent roles (coder, tester, spec, reviewer, etc.)
- 📂 Context scoping by directories / files
- 🔁 Controlled context handoff between agents
- 🧱 Responsibility isolation
- 🔄 Reproducible behavior via versioned config

---

## Core concepts

### Specification (OpenSpec-compatible)

All specifications produced and consumed by agents **must be compatible with OpenSpec**.

OpenSpec is treated as the canonical format for:

- requirements
- constraints
- acceptance criteria
- non-functional requirements

This guarantees that:

- specs are machine-readable
- specs can be reused across tools
- agents operate on a shared, strict contract

Any agent that produces specifications (e.g. `spec`, `product`, `analyst`) is required to output **valid OpenSpec documents**.

---

### Agent

An agent is a logical unit with:

- a name
- a role
- a responsibility description
- a limited context (scope)

An agent **does not see the entire project**, only what it is explicitly allowed to access.

---

### Role

A role defines:

- the type of tasks the agent performs
- reasoning style
- operational constraints

`agent-scope` provides **standard roles out of the box**, while also allowing **custom roles** to be defined per project.

#### Standard roles

- `developer` — implements and modifies production code
- `qa` — writes, validates, and analyzes tests
- `spec` — produces OpenSpec-compatible specifications
- `reviewer` — reviews code, specs, and tests for correctness and consistency

#### Custom roles

Projects may define custom roles with:

- a clear responsibility
- allowed operations
- input/output expectations

Custom roles are first-class citizens and behave exactly like standard roles.

---

### Context (Scope)

Context is an explicitly defined set of files or directories accessible to an agent.

Examples:

- `src/**`
- `tests/**`
- `docs/spec.md`

Context can be:

- local to the agent
- passed from another agent as an artifact

---

### Context handoff

Agents can pass **the results of their work** to other agents:

- requirements → coder
- code → tester
- changes → reviewer

Handoffs are **explicit and controlled**, never automatic.

---

## Example workflow

1. The `spec` agent produces **OpenSpec-compatible requirements**
2. The specification is handed off to the `developer` agent
3. The `developer` implements code within `src/`
4. The result is passed to the `qa` agent
5. The `qa` agent writes and validates tests in `tests/`

Each agent operates **only within its own scope** and against **explicit OpenSpec contracts**.

---

## Example CLI (conceptual)

```bash
agent-scope init

agent-scope agent add spec \
  --role requirements \
  --scope docs/

agent-scope agent add coder \
  --role coding \
  --scope src/

agent-scope agent add tester \
  --role testing \
  --scope tests/
```

---

## Project configuration

Configuration is stored in the repository and can be versioned.

Example structure:

```text
.agent-scope/
  agents.yaml
  flows.yaml
```

This makes agent behavior:

- transparent
- reproducible
- auditable

---

## Who this is for

- teams using AI in software development
- individual developers
- projects with strict quality requirements
- long-running or multi-agent AI workflows

---

## Philosophy

- ❌ no magic
- ❌ no hidden heuristics
- ✅ explicit roles
- ✅ explicit context
- ✅ engineering control

`agent-scope` is not AI — it is **infrastructure for AI**.

---

## Status

The project is under active development.

Ideas, feedback, and pull requests are welcome.

---

## License

MIT
