# Backlog Sync Workflow

## Overview

This workflow synchronizes the local `BACKLOG.md` with GitHub issues and ensures consistency with `ROADMAP.md`.

## Prerequisites

- GitHub CLI (`gh`) installed and authenticated
- Access to repository issues
- Valid `BACKLOG.md` and `ROADMAP.md` files

## Workflow Steps

### 1. Fetch GitHub Issues

```bash
# Get all enhancement issues
gh issue list --label enhancement --json number,title,body,state,labels --limit 100 > /tmp/github-issues.json

# Get all bug reports
gh issue list --label bug --json number,title,body,state,labels --limit 100 > /tmp/github-bugs.json
```

### 2. Analyze Current Backlog

```bash
# Extract existing backlog items
node -e "
const fs = require('fs');
const content = fs.readFileSync('BACKLOG.md', 'utf8');
const items = content.match(/^- \[[ x]\] \*\*\[.*?\]\*\* .*/gm) || [];
console.log('Current backlog items:', items.length);
items.forEach((item, i) => console.log(\`\${i+1}. \${item}\`));
"
```

### 3. Identify Missing Issues

```bash
# Compare GitHub issues with backlog items
node scripts/compare-issues-backlog.js
```

### 4. Add Missing Enhancement Issues

For each missing enhancement issue:

```markdown
## Add to BACKLOG.md

- [ ] **[MEDIUM]** Issue title from GitHub
  - **Issue**: #123
  - **Roadmap Phase**: [Determine based on issue content]
  - **Roadmap Item**: [Map to specific roadmap bullet]
  - **Effort**: [Estimate: XS/S/M/L/XL]
  - **Description**: [Summary from issue body]
  - **Labels**: [GitHub labels]
  - **Created**: [Issue creation date]
```

### 5. Update Bug Tracking

For bug reports, add to separate section:

```markdown
## Bugs and Technical Debt

- [ ] **[HIGH]** Bug title from GitHub
  - **Issue**: #456
  - **Severity**: [Critical/High/Medium/Low]
  - **Effort**: [Estimate for fix]
  - **Component**: [Affected system component]
  - **Created**: [Issue creation date]
```

### 6. Validate Consistency

```bash
# Run validation checks
npm run backlog:validate

# Sync roadmap status
npm run roadmap:sync-status --dry-run
```

### 7. Create Pull Request

```bash
# Create branch for backlog updates
git checkout -b backlog-sync-$(date +%Y%m%d)

# Add changes
git add BACKLOG.md

# Commit with descriptive message
git commit -m "feat: sync backlog with GitHub issues

- Added [X] new enhancement issues
- Added [Y] new bug reports
- Updated priority classifications
- Validated roadmap consistency

Issues synced: #123, #456, #789"

# Push and create PR
git push origin backlog-sync-$(date +%Y%m%d)
gh pr create --title "Sync backlog with GitHub issues" --body "Automated sync of BACKLOG.md with GitHub issues"
```

## Automation Triggers

### Weekly Sync (Scheduled)

```yaml
# .github/workflows/backlog-sync-weekly.yml
name: Weekly Backlog Sync

on:
  schedule:
    - cron: '0 9 * * MON' # Every Monday at 9 AM
  workflow_dispatch: # Manual trigger

jobs:
  sync-backlog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run backlog sync workflow
        run: |
          # Execute workflow steps
          node ai/workflows/backlog-sync-runner.js

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'feat: automated backlog sync'
          title: 'Automated Backlog Sync - Week of ${{ github.run_id }}'
          body: |
            Automated synchronization of BACKLOG.md with GitHub issues.

            **Changes:**
            - Synced enhancement issues with backlog
            - Updated bug tracking section
            - Validated roadmap consistency

            **Review Required:**
            - [ ] Verify issue priorities are correct
            - [ ] Check roadmap phase mappings
            - [ ] Confirm effort estimates
          branch: backlog-sync-${{ github.run_id }}
```

### Issue-Triggered Sync

```yaml
# .github/workflows/backlog-sync-on-issue.yml
name: Backlog Sync on Issue

on:
  issues:
    types: [opened, labeled, closed]

jobs:
  update-backlog:
    runs-on: ubuntu-latest
    if: contains(github.event.issue.labels.*.name, 'enhancement') || contains(github.event.issue.labels.*.name, 'bug')

    steps:
      - uses: actions/checkout@v4

      - name: Add issue to backlog
        run: |
          # Determine issue type and priority
          ISSUE_TYPE="enhancement"
          PRIORITY="MEDIUM"

          if [[ "${{ github.event.issue.labels }}" == *"bug"* ]]; then
            ISSUE_TYPE="bug"
            PRIORITY="HIGH"
          fi

          # Add to appropriate section in BACKLOG.md
          node scripts/add-issue-to-backlog.js \
            --issue-number="${{ github.event.issue.number }}" \
            --issue-title="${{ github.event.issue.title }}" \
            --issue-type="$ISSUE_TYPE" \
            --priority="$PRIORITY"

      - name: Validate and create PR
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'feat: add issue #${{ github.event.issue.number }} to backlog'
          title: 'Add issue to backlog: ${{ github.event.issue.title }}'
          body: |
            Automatically adds issue #${{ github.event.issue.number }} to the backlog.

            **Issue Details:**
            - Number: #${{ github.event.issue.number }}
            - Title: ${{ github.event.issue.title }}
            - Type: ${{ github.event.issue.labels }}
            - State: ${{ github.event.issue.state }}

            **Action Required:**
            - [ ] Review and adjust priority level
            - [ ] Map to appropriate roadmap phase
            - [ ] Estimate effort level
          branch: backlog-issue-${{ github.event.issue.number }}
```

## Manual Execution

### Quick Sync

```bash
# Run the workflow manually
npm run workflow:backlog-sync

# Or step by step:
gh issue list --label enhancement --json number,title,body > issues.json
node scripts/sync-backlog-with-issues.js
npm run backlog:validate
```

### Interactive Mode

```bash
# Interactive backlog management
npm run backlog:interactive

# This will:
# 1. Show current backlog status
# 2. List new GitHub issues
# 3. Prompt for priority and roadmap mapping
# 4. Update BACKLOG.md
# 5. Validate consistency
```

## Quality Gates

### Pre-Sync Validation

- [ ] BACKLOG.md exists and is valid markdown
- [ ] ROADMAP.md exists and has proper phase structure
- [ ] GitHub CLI is authenticated
- [ ] No uncommitted changes in working directory

### Post-Sync Validation

- [ ] All new issues have required fields
- [ ] Roadmap phase mappings are valid
- [ ] Effort estimates are provided
- [ ] No duplicate entries created
- [ ] Consistency validation passes

### Error Handling

```bash
# If sync fails, rollback changes
git checkout -- BACKLOG.md

# Log errors for investigation
echo "Sync failed at $(date): $ERROR_MESSAGE" >> .backlog-sync.log

# Notify team of sync issues
gh issue create --title "Backlog sync failed" --body "Automated sync encountered errors. See logs for details."
```

## Success Metrics

### Sync Effectiveness

- **Coverage**: % of GitHub issues represented in backlog
- **Freshness**: Time between issue creation and backlog inclusion
- **Accuracy**: % of issues with correct priority/effort estimates

### Process Efficiency

- **Automation Rate**: % of syncs completed without manual intervention
- **Error Rate**: % of syncs that fail or require rollback
- **Review Time**: Average time to review and merge sync PRs

## Troubleshooting

### Common Issues

1. **GitHub API Rate Limits**

   ```bash
   # Check rate limit status
   gh api rate_limit

   # Use pagination for large repos
   gh issue list --limit 100 --page 1
   ```

2. **Merge Conflicts**

   ```bash
   # Resolve conflicts in BACKLOG.md
   git status
   git add BACKLOG.md
   git commit -m "resolve: backlog sync conflicts"
   ```

3. **Invalid Roadmap Mappings**

   ```bash
   # Validate roadmap phases exist
   npm run roadmap:validate-phases

   # Fix mapping in BACKLOG.md
   vim BACKLOG.md
   ```

### Recovery Procedures

1. **Failed Sync Recovery**
   - Rollback BACKLOG.md changes
   - Check error logs
   - Fix underlying issue
   - Re-run sync manually

2. **Data Consistency Issues**
   - Run full validation suite
   - Compare with last known good state
   - Manually reconcile differences
   - Update validation rules if needed
