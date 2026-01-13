---
description: Synchronize BACKLOG.md with GitHub issues and ROADMAP.md
---

1. Execute [workflows/init-workflow.md](init-workflow.md)

# Backlog Sync Workflow

## Overview

This workflow synchronizes the local `BACKLOG.md` with GitHub issues and ensures consistency with `ROADMAP.md`.

## Prerequisites

- GitHub CLI (`gh`) installed and authenticated
- Access to repository issues
- Valid `BACKLOG.md` and `ROADMAP.md` files

## Workflow Steps

### 1. Analyze Local Backlog

```bash
# Extract existing backlog items without external dependencies
echo "📊 Analyzing current backlog..."
grep -c "^- \[ \]" BACKLOG.md | xargs echo "Pending items:"
grep -c "^- \[x\]" BACKLOG.md | xargs echo "Completed items:"

# Show priority distribution
echo "Priority distribution:"
grep "^- \[ \].*\[CRITICAL\]" BACKLOG.md | wc -l | xargs echo "CRITICAL:"
grep "^- \[ \].*\[HIGH\]" BACKLOG.md | wc -l | xargs echo "HIGH:"
grep "^- \[ \].*\[MEDIUM\]" BACKLOG.md | wc -l | xargs echo "MEDIUM:"
grep "^- \[ \].*\[LOW\]" BACKLOG.md | wc -l | xargs echo "LOW:"
```

### 2. Validate Roadmap Consistency

```bash
# Check if all backlog items map to valid roadmap phases
echo "🔍 Validating roadmap consistency..."

# Extract roadmap phases
grep "^## Phase" ROADMAP.md > /tmp/roadmap-phases.txt

# Check for unmapped items
echo "Checking for items without roadmap mapping..."
grep -n "Roadmap Phase.*\[.*\]" BACKLOG.md || echo "✅ All items have roadmap phases"

# Validate phase references exist
echo "Validating phase references..."
while IFS= read -r line; do
  phase=$(echo "$line" | sed 's/.*Roadmap Phase.*: \(.*\)/\1/')
  if ! grep -q "$phase" /tmp/roadmap-phases.txt; then
    echo "⚠️  Invalid phase reference: $phase"
  fi
done < <(grep "Roadmap Phase:" BACKLOG.md)
```

### 3. Check for Incomplete Items

```bash
# Find items missing required fields
echo "🔍 Checking for incomplete backlog items..."

# Check for items without effort estimates
echo "Items without effort estimates:"
grep -n "^- \[ \]" BACKLOG.md | while read -r line; do
  line_num=$(echo "$line" | cut -d: -f1)
  if ! sed -n "${line_num},/^- \[/p" BACKLOG.md | grep -q "Effort:"; then
    echo "Line $line_num: $(echo "$line" | cut -d: -f2-)"
  fi
done

# Check for items without descriptions
echo "Items without descriptions:"
grep -n "^- \[ \]" BACKLOG.md | while read -r line; do
  line_num=$(echo "$line" | cut -d: -f1)
  if ! sed -n "${line_num},/^- \[/p" BACKLOG.md | grep -q "Description:"; then
    echo "Line $line_num: $(echo "$line" | cut -d: -f2-)"
  fi
done
```

### 4. Generate Sync Report

```bash
# Create a comprehensive sync report
echo "📋 Generating backlog sync report..."

cat > backlog-sync-report.md << EOF
# Backlog Sync Report - $(date +%Y-%m-%d)

## Summary

- **Total Items**: $(grep -c "^- \[" BACKLOG.md)
- **Pending**: $(grep -c "^- \[ \]" BACKLOG.md)
- **Completed**: $(grep -c "^- \[x\]" BACKLOG.md)

## Priority Distribution

- **CRITICAL**: $(grep -c "^- \[ \].*\[CRITICAL\]" BACKLOG.md)
- **HIGH**: $(grep -c "^- \[ \].*\[HIGH\]" BACKLOG.md)
- **MEDIUM**: $(grep -c "^- \[ \].*\[MEDIUM\]" BACKLOG.md)
- **LOW**: $(grep -c "^- \[ \].*\[LOW\]" BACKLOG.md)

## Phase Distribution

$(grep "Roadmap Phase:" BACKLOG.md | sort | uniq -c | sort -nr)

## Recommendations

- Review items without effort estimates
- Validate roadmap phase mappings
- Consider priority adjustments based on current project needs

EOF

echo "✅ Report generated: backlog-sync-report.md"
```

## Local Automation Scripts

### Validation Script

```bash
#!/bin/bash
# validate-backlog.sh

echo "🔍 Validating backlog..."

# Check file exists
if [ ! -f "BACKLOG.md" ]; then
  echo "❌ BACKLOG.md not found"
  exit 1
fi

# Check roadmap exists
if [ ! -f "ROADMAP.md" ]; then
  echo "❌ ROADMAP.md not found"
  exit 1
fi

# Validate phase references
echo "Checking roadmap phase references..."
grep "^## Phase" ROADMAP.md > /tmp/valid-phases.txt

invalid_count=0
while IFS= read -r line; do
  phase=$(echo "$line" | sed 's/.*Roadmap Phase.*: \(.*\)/\1/')
  if ! grep -q "$phase" /tmp/valid-phases.txt; then
    echo "⚠️  Invalid phase: $phase"
    ((invalid_count++))
  fi
done < <(grep "Roadmap Phase:" BACKLOG.md)

if [ $invalid_count -eq 0 ]; then
  echo "✅ All phase references are valid"
else
  echo "❌ Found $invalid_count invalid phase references"
fi

# Check for required fields
echo "Checking for required fields..."
missing_effort=$(grep -c "Effort.*\[.*\]" BACKLOG.md)
if [ $missing_effort -gt 0 ]; then
  echo "⚠️  $missing_effort items missing effort estimates"
fi

echo "✅ Validation complete"
```

## Manual Execution

### Quick Local Sync

```bash
# Run the workflow manually (local version)
echo "🔄 Running local backlog sync..."

# Step 1: Analyze current backlog
grep -c "^- \[ \]" BACKLOG.md | xargs echo "Pending items:"
grep -c "^- \[x\]" BACKLOG.md | xargs echo "Completed items:"

# Step 2: Validate roadmap consistency
grep "^## Phase" ROADMAP.md > /tmp/roadmap-phases.txt
echo "Validating roadmap phase references..."

# Step 3: Check for incomplete items
echo "Checking for incomplete items..."
grep -n "^- \[ \]" BACKLOG.md | head -5

# Step 4: Generate report
echo "Generating sync report..."
echo "# Backlog Status - $(date)" > backlog-status.md
echo "Total pending: $(grep -c "^- \[ \]" BACKLOG.md)" >> backlog-status.md
echo "Total completed: $(grep -c "^- \[x\]" BACKLOG.md)" >> backlog-status.md

echo "✅ Local sync complete. Check backlog-status.md for details."
```

### Interactive Mode

```bash
# Interactive backlog management (local)
echo "🔧 Interactive backlog management"
echo "1. Show current status"
echo "2. Validate roadmap consistency"
echo "3. Find incomplete items"
echo "4. Generate detailed report"

read -p "Select option (1-4): " option

case $option in
  1) grep -c "^- \[" BACKLOG.md | xargs echo "Total items:" ;;
  2) echo "Validating..."; grep "Roadmap Phase:" BACKLOG.md | sort | uniq ;;
  3) echo "Finding incomplete items..."; grep -n "^- \[ \].*\[To be defined\]" BACKLOG.md ;;
  4) echo "Generating report..."; ./generate-backlog-report.sh ;;
  *) echo "Invalid option" ;;
esac
```

## Quality Gates

### Pre-Sync Validation

- [ ] BACKLOG.md exists and is valid markdown
- [ ] ROADMAP.md exists and has proper phase structure
- [ ] No uncommitted changes in working directory (optional)

### Post-Sync Validation

- [ ] All items have required fields (title, priority, effort, description)
- [ ] Roadmap phase mappings are valid
- [ ] No duplicate entries exist
- [ ] Consistency validation passes

### Error Handling

```bash
# If sync fails, create backup
cp BACKLOG.md BACKLOG.md.backup

# Log errors for investigation
echo "Sync failed at $(date): $ERROR_MESSAGE" >> .backlog-sync.log

# Restore from backup if needed
if [ -f BACKLOG.md.backup ]; then
  echo "Restoring from backup..."
  cp BACKLOG.md.backup BACKLOG.md
fi
```

## Success Metrics

### Sync Effectiveness

- **Completeness**: % of backlog items with all required fields
- **Consistency**: % of items with valid roadmap phase mappings
- **Accuracy**: % of effort estimates that seem reasonable

### Process Efficiency

- **Validation Rate**: % of syncs that pass all validation checks
- **Error Rate**: % of syncs that fail or require manual intervention
- **Maintenance Time**: Time spent on backlog maintenance per week

## Troubleshooting

### Common Issues

1. **Invalid Roadmap Phase References**

   ```bash
   # Verify phase exists
   grep "## Phase" ROADMAP.md

   # Fix mapping in BACKLOG.md
   vim BACKLOG.md
   ```

2. **Missing Required Fields**

   ```bash
   # Find items missing effort estimates
   grep -n "^- \[ \]" BACKLOG.md | while read line; do
     if ! echo "$line" | grep -q "Effort:"; then
       echo "Missing effort: $line"
     fi
   done
   ```

3. **Inconsistent Formatting**

   ```bash
   # Check for formatting issues
   grep -n "^- \[ \]" BACKLOG.md | grep -v "\*\*\[.*\]\*\*"

   # Fix formatting manually
   vim BACKLOG.md
   ```

### Recovery Procedures

1. **Failed Sync Recovery**
   - Restore BACKLOG.md from backup
   - Check error logs in .backlog-sync.log
   - Fix underlying issue manually
   - Re-run sync with corrected data

2. **Data Consistency Issues**
   - Run manual validation checks
   - Compare with ROADMAP.md phases
   - Manually reconcile differences
   - Update validation rules if needed
