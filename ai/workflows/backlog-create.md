---
description: Create new backlog items and convert them to OpenSpec change proposals.
---

# Backlog Create Workflow

## Overview

This workflow guides the creation of new backlog items and their conversion to OpenSpec change proposals, ensuring proper integration with the roadmap and development process.

## Prerequisites

- Valid `BACKLOG.md` and `ROADMAP.md` files
- Understanding of roadmap phases and priorities
- OpenSpec CLI available for change proposal creation

## Workflow Steps

### 1. Gather Requirements

#### From User Story

```bash
# Interactive prompt for user story details
echo "Creating new backlog item..."
read -p "Feature title: " TITLE
read -p "User story (As a... I want... So that...): " USER_STORY
read -p "Priority (CRITICAL/HIGH/MEDIUM/LOW): " PRIORITY
read -p "Estimated effort (XS/S/M/L/XL): " EFFORT
```

#### From Local Issue Template

```bash
# Create local issue template for manual input
cat > /tmp/issue-template.md << EOF
# Issue Title
[Enter issue title here]

# User Story
As a [role], I want [feature], so that [benefit]

# Priority
[CRITICAL/HIGH/MEDIUM/LOW]

# Effort Estimate
[XS/S/M/L/XL]

# Additional Context
[Any additional context or requirements]
EOF

echo "📝 Issue template created at /tmp/issue-template.md"
echo "Please edit the template and run the script again"
```

### 2. Map to Roadmap Phase

#### Interactive Phase Selection

```bash
echo "Available roadmap phases:"
echo "0. Phase 0 - Project Bootstrap"
echo "1. Phase 1 - Agent Memory & Skills"
echo "2. Phase 2 - Spec-Driven Development"
echo "3. Phase 3 - Execution Engine & Guardrails"
echo "4. Phase 4 - Advanced Context Engineering"
echo "5. Phase 5 - Developer Tooling"
echo "6. Phase 6 - Distribution & Ecosystem"

read -p "Select phase (0-6): " PHASE_NUMBER
```

#### Validate Phase Mapping

```bash
# Check if phase exists in roadmap
PHASE_NAME="Phase $PHASE_NUMBER"
if ! grep -q "## $PHASE_NAME" ROADMAP.md; then
  echo "❌ Error: Phase $PHASE_NUMBER not found in roadmap"
  exit 1
fi

# Extract phase details
PHASE_TITLE=$(grep "## $PHASE_NAME" ROADMAP.md | head -n 1)
echo "✅ Mapped to: $PHASE_TITLE"
```

### 3. Determine Roadmap Item Mapping

```bash
# Show available items in selected phase
echo "Available items in $PHASE_TITLE:"
sed -n "/## $PHASE_NAME/,/## /p" ROADMAP.md | grep "^- \[" | nl

read -p "Select roadmap item number: " ITEM_NUMBER

# Extract specific roadmap item
ROADMAP_ITEM=$(sed -n "/## $PHASE_NAME/,/## /p" ROADMAP.md | grep "^- \[" | sed -n "${ITEM_NUMBER}p")
echo "✅ Mapped to roadmap item: $ROADMAP_ITEM"
```

### 4. Generate Backlog Entry

```bash
# Create formatted backlog entry
cat >> BACKLOG.md << EOF

- [ ] **[$PRIORITY]** $TITLE
  - **Roadmap Phase**: $PHASE_TITLE
  - **Roadmap Item**: $ROADMAP_ITEM
  - **Effort**: $EFFORT
  - **Description**: $USER_STORY
  - **Acceptance Criteria**:
    - [ ] [To be defined]
  - **Dependencies**: [None identified]
  - **OpenSpec Change**: [To be created]
  - **Created**: $(date +%Y-%m-%d)
EOF

echo "✅ Added backlog item to BACKLOG.md"
```

### 5. Create OpenSpec Change Proposal

#### Generate Change ID

```bash
# Create kebab-case change ID from title
CHANGE_ID=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
echo "Generated change ID: $CHANGE_ID"

# Check if change ID already exists
if [ -d "openspec/changes/$CHANGE_ID" ]; then
  echo "⚠️  Change ID already exists, appending timestamp"
  CHANGE_ID="$CHANGE_ID-$(date +%s)"
fi
```

#### Create Change Directory Structure

```bash
# Create change proposal directory
mkdir -p "openspec/changes/$CHANGE_ID/specs"

echo "📁 Created change directory: openspec/changes/$CHANGE_ID"
```

#### Generate Proposal Document

```bash
cat > "openspec/changes/$CHANGE_ID/proposal.md" << EOF
# Change: $TITLE

## Why

$USER_STORY

## What Changes

- [Specific changes to be defined during design phase]

## Impact

- **Affected specs**: [To be determined]
- **Affected code**: [To be determined]
- **Priority**: $PRIORITY
- **Estimated effort**: $EFFORT
- **Roadmap phase**: $PHASE_TITLE
- **Roadmap item**: $ROADMAP_ITEM

## Acceptance Criteria

- [ ] [Criterion 1 - to be defined]
- [ ] [Criterion 2 - to be defined]
- [ ] [Criterion 3 - to be defined]

## Dependencies

- [List any prerequisite changes or features]

## References

- **Backlog item**: $TITLE
- **Created**: $(date +%Y-%m-%d)
- **GitHub issue**: [If applicable]

## Notes

- This proposal was generated from backlog item
- Detailed requirements and design to be added during planning phase
- Follow OpenSpec validation process before implementation
EOF

echo "✅ Created proposal: openspec/changes/$CHANGE_ID/proposal.md"
```

#### Generate Tasks Document

```bash
cat > "openspec/changes/$CHANGE_ID/tasks.md" << EOF
# Implementation Tasks: $TITLE

## 1. Requirements Analysis

- [ ] 1.1 Analyze and refine acceptance criteria
- [ ] 1.2 Identify system dependencies and constraints
- [ ] 1.3 Define detailed functional requirements
- [ ] 1.4 Create user interaction flows (if applicable)

## 2. Technical Design

- [ ] 2.1 Design system architecture and components
- [ ] 2.2 Define API contracts and data models
- [ ] 2.3 Identify integration points
- [ ] 2.4 Create technical specification document
- [ ] 2.5 Review design with team

## 3. Implementation

- [ ] 3.1 Set up development environment and dependencies
- [ ] 3.2 Implement core functionality
- [ ] 3.3 Add error handling and edge cases
- [ ] 3.4 Implement user interface (if applicable)
- [ ] 3.5 Add logging and monitoring

## 4. Testing

- [ ] 4.1 Write unit tests (85%+ coverage required)
- [ ] 4.2 Write integration tests
- [ ] 4.3 Perform manual testing and validation
- [ ] 4.4 Test error scenarios and edge cases
- [ ] 4.5 Performance testing (if applicable)

## 5. Documentation

- [ ] 5.1 Add TSDoc comments to all public functions
- [ ] 5.2 Update README.md with new features
- [ ] 5.3 Update CHANGELOG.md with changes
- [ ] 5.4 Create user documentation (if applicable)

## 6. Quality Assurance

- [ ] 6.1 Run full test suite and ensure all tests pass
- [ ] 6.2 Verify code coverage meets 85% threshold
- [ ] 6.3 Run linting and formatting checks
- [ ] 6.4 Perform security audit
- [ ] 6.5 Check performance benchmarks

## 7. Deployment and Rollout

- [ ] 7.1 Create deployment plan
- [ ] 7.2 Prepare release notes
- [ ] 7.3 Deploy to staging environment
- [ ] 7.4 Perform acceptance testing
- [ ] 7.5 Deploy to production
- [ ] 7.6 Monitor deployment and performance

## Notes

- **Effort estimate**: $EFFORT
- **Priority**: $PRIORITY
- **Roadmap alignment**: $PHASE_TITLE
- Follow coding standards in \`ai/rules/\`
- Ensure all pre-commit hooks pass
- Reference change ID in commit messages: \`$CHANGE_ID\`

## Definition of Done

- [ ] All tasks completed and verified
- [ ] Code review completed and approved
- [ ] All tests passing with required coverage
- [ ] Documentation updated and reviewed
- [ ] Feature deployed and working in production
- [ ] Backlog item marked as complete
- [ ] OpenSpec change archived
EOF

echo "✅ Created tasks: openspec/changes/$CHANGE_ID/tasks.md"
```

### 6. Update Backlog with Change ID

```bash
# Update backlog entry with OpenSpec change ID
sed -i "s/\*\*OpenSpec Change\*\*: \[To be created\]/\*\*OpenSpec Change\*\*: $CHANGE_ID/" BACKLOG.md

echo "✅ Updated backlog with change ID: $CHANGE_ID"
```

### 7. Validate and Review

```bash
# Validate OpenSpec change proposal
if command -v openspec &> /dev/null; then
  echo "🔍 Validating OpenSpec change proposal..."
  openspec validate "$CHANGE_ID" --strict
else
  echo "⚠️  OpenSpec CLI not available, skipping validation"
fi

# Validate backlog-roadmap consistency
npm run backlog:validate

echo "✅ Validation complete"
```

### 8. Create Development Branch

```bash
# Create feature branch for development
git checkout -b "feature/$CHANGE_ID"

# Add all changes
git add BACKLOG.md "openspec/changes/$CHANGE_ID/"

# Commit with structured message
git commit -m "feat: add backlog item and OpenSpec change for $TITLE

- Added backlog item with $PRIORITY priority
- Created OpenSpec change proposal: $CHANGE_ID
- Mapped to roadmap: $PHASE_TITLE
- Estimated effort: $EFFORT

Change-Id: $CHANGE_ID"

echo "✅ Created feature branch: feature/$CHANGE_ID"
```

## Automation Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/backlog-create.yml
name: Create Backlog Item

on:
  workflow_dispatch:
    inputs:
      title:
        description: 'Feature title'
        required: true
        type: string
      user_story:
        description: 'User story (As a... I want... So that...)'
        required: true
        type: string
      priority:
        description: 'Priority level'
        required: true
        type: choice
        options:
          - CRITICAL
          - HIGH
          - MEDIUM
          - LOW
      effort:
        description: 'Estimated effort'
        required: true
        type: choice
        options:
          - XS
          - S
          - M
          - L
          - XL
      phase:
        description: 'Roadmap phase (0-6)'
        required: true
        type: choice
        options:
          - '0'
          - '1'
          - '2'
          - '3'
          - '4'
          - '5'
          - '6'

jobs:
  create-backlog-item:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Create backlog item
        run: |
          # Run backlog creation workflow
          node ai/workflows/backlog-create-runner.js \
            --title="${{ github.event.inputs.title }}" \
            --user-story="${{ github.event.inputs.user_story }}" \
            --priority="${{ github.event.inputs.priority }}" \
            --effort="${{ github.event.inputs.effort }}" \
            --phase="${{ github.event.inputs.phase }}"

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'feat: add backlog item - ${{ github.event.inputs.title }}'
          title: 'Add backlog item: ${{ github.event.inputs.title }}'
          body: |
            **New Backlog Item Created**

            - **Title**: ${{ github.event.inputs.title }}
            - **Priority**: ${{ github.event.inputs.priority }}
            - **Effort**: ${{ github.event.inputs.effort }}
            - **Phase**: Phase ${{ github.event.inputs.phase }}

            **User Story**: ${{ github.event.inputs.user_story }}

            **Review Checklist**:
            - [ ] Verify roadmap phase mapping is correct
            - [ ] Confirm priority and effort estimates
            - [ ] Review OpenSpec change proposal
            - [ ] Validate acceptance criteria
          branch: backlog-item-${{ github.run_id }}
```

### CLI Integration

```bash
# Add to package.json scripts
"backlog:create:interactive": "node ai/workflows/backlog-create-runner.js --interactive",
"backlog:create:from-issue": "node ai/workflows/backlog-create-runner.js --from-issue",
"backlog:create:quick": "node ai/workflows/backlog-create-runner.js --quick"
```

## Quality Gates

### Pre-Creation Validation

- [ ] Title is clear and actionable
- [ ] User story follows proper format
- [ ] Priority level is justified
- [ ] Effort estimate is reasonable
- [ ] Roadmap phase mapping is valid

### Post-Creation Validation

- [ ] Backlog entry has all required fields
- [ ] OpenSpec change proposal is valid
- [ ] Change ID is unique and follows conventions
- [ ] Tasks document is comprehensive
- [ ] Backlog-roadmap consistency maintained

## Success Metrics

### Creation Efficiency

- **Time to Create**: Average time from idea to backlog entry
- **Completeness**: % of items created with all required fields
- **Accuracy**: % of effort estimates that match actual implementation

### Process Quality

- **Roadmap Alignment**: % of items properly mapped to roadmap phases
- **OpenSpec Adoption**: % of items that generate change proposals
- **Validation Pass Rate**: % of items that pass consistency checks

## Troubleshooting

### Common Issues

1. **Invalid Roadmap Phase**

   ```bash
   # Verify phase exists
   grep "## Phase" ROADMAP.md

   # Update phase mapping
   vim BACKLOG.md
   ```

2. **Duplicate Change ID**

   ```bash
   # Check existing changes
   ls openspec/changes/

   # Generate new unique ID
   CHANGE_ID="$CHANGE_ID-$(date +%s)"
   ```

3. **Validation Failures**

   ```bash
   # Run detailed validation
   npm run backlog:validate --verbose

   # Fix identified issues
   vim BACKLOG.md
   ```
