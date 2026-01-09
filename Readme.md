# agent-scope

CLI tool for configuring and orchestrating AI agents in software projects.

`agent-scope` allows you to define AI agent roles (architect, developer, qa, reviewer), strictly limit their context, and explicitly control how context is passed between agents within a project.

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
- 🎭 Agent roles (architect, developer, qa, reviewer)
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

- `architect` — creates technical designs and system architecture
- `developer` — implements and modifies production code
- `qa` — writes, validates, and analyzes tests
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

## Multi-Agent SDD Cycle

`agent-scope` includes built-in support for **Specification-Driven Development (SDD)** workflows with multiple specialized agents:

### Standard Agent Roles

- **Architect** — Creates technical designs and system architecture
- **Developer** — Implements features based on specifications
- **QA** — Writes and validates tests, ensures quality
- **Reviewer** — Reviews code, specs, and tests for correctness

### SDD Workflow (Logic Flow-Inspired)

The project follows a structured, design-first development workflow with clear validation gates:

1. **Business Context**: Define "Why" and "Who" in `architecture/BUSINESS.md`.
2. **Overall Design**: Define system architecture and domain models in `architecture/DESIGN.md`.
3. **Feature Planning**: Decompose design into features in `architecture/features/FEATURES.md`.
4. **Feature Design**: Define "What" and "How" for specific features in `architecture/features/feature-{slug}/DESIGN.md`. All logic uses **Logic Flow** (Plain English Logic).
5. **Implementation**: Execute specific tasks with targeted, isolated context.

### Key Concepts

#### Design Hierarchy

- **BUSINESS.md**: Project vision, actors, and core capabilities.
- **DESIGN.md**: Multi-layered technical architecture and machine-readable domain models.
- **FEATURES.md**: Manifest tracking the status and dependencies of all system features.

#### Logic Flow (Plain English Logic)

Standardized, plain English pseudocode for documenting algorithms and actor flows. **Code is prohibited in design documents** to ensure logical correctness can be reviewed by any stakeholder.

#### Validation Gates

Automated workflows ensure every design artifact meets structural and logical standards before implementation begins.

Example workflows:

- `sdd-cycle.md` — Full specification-driven development cycle
- `implement-feature.md` — Feature implementation with multi-agent coordination

## Example workflow

1. The `architect` agent produces **OpenSpec-compatible requirements and design**
2. The specification is handed off to the `developer` agent
3. The `developer` implements code within `src/`
4. The result is passed to the `qa` agent
5. The `qa` agent writes and validates tests in `tests/`

Each agent operates **only within its own scope** and against **explicit OpenSpec contracts**.

---

## CLI Usage

### Initialize project

```bash
agent-scope init
```

This creates the `.agent/` directory and an `AGENTS.md` file (which is also linked to `openspec/AGENTS.md` if the project uses OpenSpec).

### Manage Agents

```bash
# List all configured agents
agent-scope agent list

# Add a new agent
agent-scope agent add "Coder" \
  --role "developer" \
  --scope "src/**" \
  --description "Implements core logic"
```

### Manage Skills

```bash
# Add a new skill template
agent-scope skill add "SecurityAudit"
```

### Development Environment Setup

`agent-scope` can automatically configure your IDE and AI development tools during project initialization:

```bash
agent-scope init
```

**Supported IDE/AI Tools:**

- **Windsurf** — Creates `.windsurf/` directory with copies of agents, rules, and workflows from `.agent/`
- **Universal agent** — Creates `.agent/` directory for any AI tool supporting AGENTS.md format

**Windsurf Integration:**

When Windsurf is selected, `agent-scope`:

1. Creates `.agent/` directory with:
   - `agents/` — Agent definitions
   - `rules/` — Project-specific rules
   - `workflows/` — Development workflows
   - `AGENTS.md` — Agent instructions
2. Copies all content from `.agent/` to `.windsurf/`
3. Removes `.agent/` if Universal agent is not selected (Windsurf has its own copy)

This allows Windsurf to access all project-specific configurations seamlessly.

**Universal Agent Integration:**

When Universal agent is selected, `agent-scope` creates:

- `.agent/` directory with:
  - `AGENTS.md` — Agent instructions
  - `agents/` — Agent definitions
  - `rules/` — Project-specific rules
  - `workflows/` — Development workflows

**Combined Selection:**

When both Windsurf and Universal agent are selected:

- `.windsurf/` directory is created with copies of all `.agent/` content
- `.agent/` directory persists for Universal agent to use

**Update Environment:**

```bash
# Update IDE and AI tool configurations
agent-scope env update
```

**Clear Environment:**

```bash
# Remove .agent and .windsurf directories
agent-scope clear
```

---

## Project configuration

Configuration is stored in the `.agent/` directory:

```text
.agent/
  agents.yaml   # Agent definitions
  AGENTS.md     # Project-level agent instructions
  skills/       # Reusable skill markdown files
```

The system also supports legacy migration from `ai/` and root `AGENTS.md` during `init`.

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
