# Backlog-Roadmap Consistency Rules

## Overview

This document defines rules for maintaining consistency between `BACKLOG.md` (tactical, sprint-level planning) and `ROADMAP.md` (strategic, phase-level planning).

## ⚠️ CRITICAL: Two-Level Planning System

### ROADMAP.md - Strategic Level

- **Purpose**: High-level phases and long-term vision
- **Scope**: 3-6 month planning horizon
- **Granularity**: Features and capabilities
- **Audience**: Stakeholders, architects, product managers

### BACKLOG.md - Tactical Level

- **Purpose**: Sprint-level tasks and immediate work
- **Scope**: 1-4 week planning horizon
- **Granularity**: Specific tasks and user stories
- **Audience**: Developers, QA, immediate team

---

## Consistency Rules

### ⚠️ CRITICAL: Phase Alignment

**Every backlog item MUST map to a roadmap phase.**

```markdown
# BACKLOG.md format

- [ ] **[HIGH]** CLI help system implementation
  - **Roadmap Phase**: Phase 1 - Agent Memory & Skills
  - **Roadmap Item**: CLI Commands
  - **Effort**: S (2-3 days)
```

### Required Mapping Fields

All backlog items MUST include:

- **Roadmap Phase**: Which phase this belongs to
- **Roadmap Item**: Specific roadmap bullet point
- **Effort**: Estimation using standard scale
- **Dependencies**: Links to prerequisite roadmap items

---

## Phase Mapping Guidelines

### Phase 0 - Project Bootstrap

**Backlog Categories:**

- Infrastructure setup
- Development tooling
- CI/CD pipeline
- Documentation foundation

**Example Backlog Items:**

```markdown
- [ ] **[HIGH]** Setup comprehensive coding standards
  - **Roadmap Phase**: Phase 0 - Project Bootstrap
  - **Roadmap Item**: CI pipeline (tests, lint, typecheck, pre-commit hooks)
  - **Effort**: M (1 week)
```

### Phase 1 - Agent Memory & Skills

**Backlog Categories:**

- Agent definition and management
- Skill system implementation
- CLI command development
- Memory block support

**Example Backlog Items:**

```markdown
- [ ] **[MEDIUM]** Implement agent skill loading system
  - **Roadmap Phase**: Phase 1 - Agent Memory & Skills
  - **Roadmap Item**: Level 2 (Instructions) - Markdown-based instructions
  - **Effort**: L (2-3 weeks)
  - **Dependencies**: Agent definition system
```

### Phase 2 - Spec-Driven Development

**Backlog Categories:**

- Workflow orchestration
- Artifact management
- OpenSpec integration
- Planning tools

### Phase 3 - Execution Engine & Guardrails

**Backlog Categories:**

- Hook system implementation
- Safety mechanisms
- Quality checks
- Guardrail integration

### Phase 4 - Advanced Context Engineering

**Backlog Categories:**

- Context isolation
- Subagent sandboxing
- Knowledge management
- MCP integration

### Phase 5 - Developer Tooling

**Backlog Categories:**

- CLI diagnostics
- IDE integration
- Visualization tools
- Developer experience

### Phase 6 - Distribution & Ecosystem

**Backlog Categories:**

- Package publication
- Documentation site
- Template library
- Release automation

---

## Status Synchronization Rules

### ⚠️ CRITICAL: Roadmap Status Updates

**When backlog items are completed, roadmap MUST be updated.**

#### Completion Workflow

1. Mark backlog item as complete: `- [x]`
2. Check if all related backlog items for roadmap item are complete
3. If yes, update roadmap item: `- [x]`
4. If roadmap phase is complete, update phase status

#### Roadmap Status Indicators

```markdown
## Phase 1 — Agent Memory & Skills ✅ COMPLETE

### AI Agents & Roles ✅ COMPLETE

- [x] AI agent definition (name, role, model, scope)
- [x] Agent Memory Blocks: Support for AGENTS.md format
- [x] Built-in roles: developer, qa, architect, reviewer

### Reusable Skills (3-Level Architecture) 🚧 IN PROGRESS

- [x] Level 1 (Metadata): YAML frontmatter loaded at startup
- [x] Level 2 (Instructions): Markdown-based instructions
- [ ] Level 3 (Resources): External code/docs loaded into context
```

#### Status Legend

- ✅ **COMPLETE**: All items finished
- 🚧 **IN PROGRESS**: Some items complete, others in development
- 📋 **PLANNED**: Not started, in backlog
- ⏸️ **BLOCKED**: Waiting on dependencies
- ❌ **CANCELLED**: No longer planned

---

## Validation Rules

### ⚠️ CRITICAL: Consistency Checks

**Before each commit, validate consistency:**

```bash
# Check that all backlog items reference roadmap phases
npm run backlog:validate

# Check that roadmap status matches backlog completion
npm run roadmap:sync-status
```

### Validation Script Requirements

1. **Orphaned Items**: No backlog items without roadmap mapping
2. **Missing Items**: All roadmap items have corresponding backlog tasks
3. **Status Mismatch**: Roadmap status reflects backlog completion
4. **Phase Ordering**: Backlog respects roadmap phase dependencies

---

## Maintenance Workflows

### Weekly Backlog Review

```bash
# 1. Review current sprint progress
npm run backlog:view

# 2. Check roadmap alignment
npm run backlog:validate

# 3. Update roadmap status
npm run roadmap:sync-status

# 4. Plan next sprint items from roadmap
```

### Monthly Roadmap Review

```bash
# 1. Review phase completion
grep -E "✅|🚧|📋" ROADMAP.md

# 2. Update phase priorities based on learnings
# 3. Adjust timeline estimates
# 4. Communicate changes to stakeholders
```

### Quarterly Strategic Review

- Evaluate roadmap phases against business goals
- Adjust phase priorities and scope
- Update long-term vision
- Align with product strategy

---

## Automation Rules

### ⚠️ CRITICAL: Automated Synchronization

**GitHub Actions MUST maintain consistency:**

```yaml
# .github/workflows/backlog-roadmap-sync.yml
on:
  push:
    paths: ['BACKLOG.md', 'ROADMAP.md']

jobs:
  validate-consistency:
    - name: Validate backlog-roadmap consistency
      run: npm run backlog:validate

    - name: Update roadmap status
      run: npm run roadmap:sync-status

    - name: Check for orphaned items
      run: npm run backlog:check-orphans
```

### Pre-commit Hook Integration

```bash
# Add to .pre-commit-config.yaml
- id: backlog-roadmap-consistency
  name: Validate backlog-roadmap consistency
  entry: npm run backlog:validate
  language: system
  files: ^(BACKLOG|ROADMAP)\.md$
```

---

## Documentation Standards

### Backlog Item Format

```markdown
- [ ] **[PRIORITY]** Clear, actionable title
  - **Roadmap Phase**: Phase X - Phase Name
  - **Roadmap Item**: Specific roadmap bullet point
  - **Effort**: XS/S/M/L/XL (time estimate)
  - **Dependencies**: List of prerequisite items
  - **Acceptance Criteria**:
    - [ ] Criterion 1
    - [ ] Criterion 2
  - **OpenSpec Change**: change-id (if applicable)
```

### Roadmap Item Format

```markdown
### Feature Category Status

- [x] Completed item with clear deliverable
- [ ] Pending item with specific scope
- [ ] **Blocked:** Item waiting on dependency (explain why)
```

---

## Quality Gates

### ⚠️ CRITICAL: No Implementation Without Planning

**Before starting any development:**

1. **Roadmap Check**: Verify item exists in roadmap
2. **Backlog Entry**: Create detailed backlog item with mapping
3. **OpenSpec Change**: Create change proposal for significant features
4. **Validation**: Run consistency checks
5. **Approval**: Get stakeholder sign-off for phase changes

### Definition of Done

**For Backlog Items:**

- [ ] Implementation complete
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Roadmap status updated
- [ ] OpenSpec change archived (if applicable)

**For Roadmap Phases:**

- [ ] All phase items complete
- [ ] Phase retrospective conducted
- [ ] Lessons learned documented
- [ ] Next phase planning updated
- [ ] Stakeholder communication sent

---

## Escalation Procedures

### Scope Changes

- **Minor**: Update backlog item details
- **Major**: Require roadmap phase adjustment
- **Strategic**: Require quarterly review cycle

### Blocking Issues

- **Technical**: Create technical debt backlog item
- **Resource**: Escalate to project management
- **Strategic**: Escalate to product leadership

### Timeline Delays

- **Sprint**: Adjust current sprint scope
- **Phase**: Re-evaluate phase timeline and dependencies
- **Strategic**: Communicate impact to stakeholders

---

## Success Metrics

### Consistency Metrics

- **Mapping Coverage**: % of backlog items with roadmap mapping
- **Status Accuracy**: % of roadmap status matching backlog reality
- **Orphan Rate**: % of backlog items without roadmap connection

### Planning Effectiveness

- **Velocity Accuracy**: Actual vs estimated effort
- **Phase Completion**: On-time phase delivery rate
- **Scope Stability**: % of phase scope changes

### Quality Indicators

- **Validation Failures**: Consistency check failure rate
- **Rework Rate**: % of items requiring significant changes
- **Stakeholder Satisfaction**: Feedback on planning accuracy
