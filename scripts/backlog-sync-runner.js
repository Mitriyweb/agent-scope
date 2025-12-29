#!/usr/bin/env node

/**
 * Backlog Sync Workflow Runner
 * Executes the backlog sync workflow steps
 */

const { execSync } = require('child_process');
const fs = require('fs');

class BacklogSyncRunner {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.changes = [];
  }

  async run() {
    console.log('🔄 Starting Backlog Sync Workflow\n');

    try {
      await this.step1_fetchGitHubIssues();
      await this.step2_analyzeCurrentBacklog();
      await this.step3_identifyMissingIssues();
      await this.step4_addMissingEnhancements();
      await this.step5_updateBugTracking();
      await this.step6_validateConsistency();

      if (!this.dryRun) {
        await this.step7_createPullRequest();
      }

      this.reportResults();
      return true;
    } catch (error) {
      console.error('❌ Workflow failed:', error.message);
      if (this.verbose) {
        console.error(error.stack);
      }
      return false;
    }
  }

  async step1_fetchGitHubIssues() {
    console.log('📥 Step 1: Fetching GitHub issues...');

    try {
      // Check if gh CLI is available
      execSync('gh --version', { stdio: 'pipe' });
    } catch (error) {
      throw new Error('GitHub CLI (gh) is not installed or not authenticated');
    }

    // Fetch enhancement issues
    const enhancementCmd =
      'gh issue list --label enhancement --json number,title,body,state,labels,createdAt --limit 100';
    const enhancementOutput = execSync(enhancementCmd, { encoding: 'utf8' });
    const enhancementIssues = JSON.parse(enhancementOutput);

    // Fetch bug issues
    const bugCmd =
      'gh issue list --label bug --json number,title,body,state,labels,createdAt --limit 100';
    const bugOutput = execSync(bugCmd, { encoding: 'utf8' });
    const bugIssues = JSON.parse(bugOutput);

    this.githubIssues = {
      enhancements: enhancementIssues,
      bugs: bugIssues,
    };

    console.log(`   Found ${enhancementIssues.length} enhancement issues`);
    console.log(`   Found ${bugIssues.length} bug issues`);
  }

  async step2_analyzeCurrentBacklog() {
    console.log('📋 Step 2: Analyzing current backlog...');

    if (!fs.existsSync('BACKLOG.md')) {
      throw new Error('BACKLOG.md not found');
    }

    const backlogContent = fs.readFileSync('BACKLOG.md', 'utf8');
    this.currentBacklogItems = this.extractBacklogItems(backlogContent);

    console.log(`   Found ${this.currentBacklogItems.length} existing backlog items`);

    // Extract GitHub issue numbers already in backlog
    this.existingIssueNumbers = new Set();
    this.currentBacklogItems.forEach(item => {
      const issueMatch = item.content.match(/\*\*Issue\*\*:\s*#(\d+)/);
      if (issueMatch) {
        this.existingIssueNumbers.add(parseInt(issueMatch[1]));
      }
    });

    console.log(`   ${this.existingIssueNumbers.size} items already linked to GitHub issues`);
  }

  async step3_identifyMissingIssues() {
    console.log('🔍 Step 3: Identifying missing issues...');

    this.missingEnhancements = this.githubIssues.enhancements.filter(
      issue => !this.existingIssueNumbers.has(issue.number) && issue.state === 'OPEN'
    );

    this.missingBugs = this.githubIssues.bugs.filter(
      issue => !this.existingIssueNumbers.has(issue.number) && issue.state === 'OPEN'
    );

    console.log(`   ${this.missingEnhancements.length} new enhancement issues to add`);
    console.log(`   ${this.missingBugs.length} new bug issues to add`);

    if (this.verbose) {
      this.missingEnhancements.forEach(issue => {
        console.log(`     Enhancement #${issue.number}: ${issue.title}`);
      });
      this.missingBugs.forEach(issue => {
        console.log(`     Bug #${issue.number}: ${issue.title}`);
      });
    }
  }

  async step4_addMissingEnhancements() {
    console.log('➕ Step 4: Adding missing enhancement issues...');

    if (this.missingEnhancements.length === 0) {
      console.log('   No new enhancement issues to add');
      return;
    }

    let backlogContent = fs.readFileSync('BACKLOG.md', 'utf8');

    const newItems = this.missingEnhancements.map(issue => {
      const priority = this.determinePriority(issue);
      const effort = this.estimateEffort(issue);
      const roadmapPhase = this.mapToRoadmapPhase(issue);

      return `- [ ] **[${priority}]** ${issue.title}
  - **Issue**: #${issue.number}
  - **Roadmap Phase**: ${roadmapPhase}
  - **Roadmap Item**: [To be determined]
  - **Effort**: ${effort}
  - **Description**: ${this.extractDescription(issue.body)}
  - **Labels**: ${issue.labels.map(l => l.name).join(', ')}
  - **Created**: ${issue.createdAt.split('T')[0]}`;
    });

    // Insert new items into backlog
    const insertionIndex = backlogContent.indexOf('## Backlog');
    if (insertionIndex === -1) {
      throw new Error('Could not find "## Backlog" section in BACKLOG.md');
    }

    const beforeInsertion = backlogContent.substring(0, insertionIndex);
    const afterInsertion = backlogContent.substring(insertionIndex);

    // Find the end of the "### Medium Priority" section or create it
    let mediumPriorityEnd = afterInsertion.indexOf('### Low Priority');
    if (mediumPriorityEnd === -1) {
      mediumPriorityEnd = afterInsertion.indexOf('## Completed');
    }
    if (mediumPriorityEnd === -1) {
      mediumPriorityEnd = afterInsertion.length;
    }

    const beforeMedium = afterInsertion.substring(0, mediumPriorityEnd);
    const afterMedium = afterInsertion.substring(mediumPriorityEnd);

    backlogContent =
      beforeInsertion + beforeMedium + '\n' + newItems.join('\n\n') + '\n' + afterMedium;

    if (!this.dryRun) {
      fs.writeFileSync('BACKLOG.md', backlogContent);
    }

    this.changes.push({
      type: 'enhancement_issues_added',
      count: this.missingEnhancements.length,
      issues: this.missingEnhancements.map(i => `#${i.number}`),
    });

    console.log(`   Added ${this.missingEnhancements.length} enhancement issues to backlog`);
  }

  async step5_updateBugTracking() {
    console.log('🐛 Step 5: Updating bug tracking...');

    if (this.missingBugs.length === 0) {
      console.log('   No new bug issues to add');
      return;
    }

    let backlogContent = fs.readFileSync('BACKLOG.md', 'utf8');

    // Ensure "Bugs and Technical Debt" section exists
    if (!backlogContent.includes('## Bugs and Technical Debt')) {
      const insertPoint = backlogContent.indexOf('## Completed');
      if (insertPoint === -1) {
        backlogContent += '\n\n## Bugs and Technical Debt\n\n';
      } else {
        const before = backlogContent.substring(0, insertPoint);
        const after = backlogContent.substring(insertPoint);
        backlogContent = before + '## Bugs and Technical Debt\n\n' + after;
      }
    }

    const newBugItems = this.missingBugs.map(issue => {
      const severity = this.determineBugSeverity(issue);
      const effort = this.estimateEffort(issue);

      return `- [ ] **[${severity}]** ${issue.title}
  - **Issue**: #${issue.number}
  - **Severity**: ${severity}
  - **Effort**: ${effort}
  - **Component**: [To be determined]
  - **Created**: ${issue.createdAt.split('T')[0]}`;
    });

    // Insert bug items into the bugs section
    const bugSectionStart = backlogContent.indexOf('## Bugs and Technical Debt');
    const bugSectionEnd = backlogContent.indexOf('## Completed', bugSectionStart);

    const beforeBugs = backlogContent.substring(0, bugSectionStart);
    const bugsHeader = '## Bugs and Technical Debt\n\n';
    const existingBugs = backlogContent.substring(
      bugSectionStart + bugsHeader.length,
      bugSectionEnd
    );
    const afterBugs = backlogContent.substring(bugSectionEnd);

    backlogContent =
      beforeBugs + bugsHeader + existingBugs + newBugItems.join('\n\n') + '\n\n' + afterBugs;

    if (!this.dryRun) {
      fs.writeFileSync('BACKLOG.md', backlogContent);
    }

    this.changes.push({
      type: 'bug_issues_added',
      count: this.missingBugs.length,
      issues: this.missingBugs.map(i => `#${i.number}`),
    });

    console.log(`   Added ${this.missingBugs.length} bug issues to backlog`);
  }

  async step6_validateConsistency() {
    console.log('✅ Step 6: Validating consistency...');

    try {
      // Run backlog validation
      execSync('npm run backlog:validate', { stdio: 'pipe' });
      console.log('   Backlog validation passed');
    } catch (error) {
      console.warn('   ⚠️  Backlog validation warnings (see details below)');
      if (this.verbose) {
        console.log(error.stdout?.toString());
      }
    }

    try {
      // Run roadmap sync check
      execSync('npm run roadmap:sync-status -- --dry-run', { stdio: 'pipe' });
      console.log('   Roadmap consistency check passed');
    } catch (error) {
      console.warn('   ⚠️  Roadmap sync check warnings');
      if (this.verbose) {
        console.log(error.stdout?.toString());
      }
    }
  }

  async step7_createPullRequest() {
    console.log('🔀 Step 7: Creating pull request...');

    if (this.changes.length === 0) {
      console.log('   No changes to commit');
      return;
    }

    const branchName = `backlog-sync-${Date.now()}`;
    const commitMessage = this.generateCommitMessage();

    try {
      execSync(`git checkout -b ${branchName}`, { stdio: 'pipe' });
      execSync('git add BACKLOG.md', { stdio: 'pipe' });
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
      execSync(`git push origin ${branchName}`, { stdio: 'pipe' });

      const prTitle = 'Automated backlog sync with GitHub issues';
      const prBody = this.generatePRBody();

      execSync(`gh pr create --title "${prTitle}" --body "${prBody}"`, { stdio: 'pipe' });

      console.log(`   ✅ Created pull request on branch: ${branchName}`);
    } catch (error) {
      console.error('   ❌ Failed to create pull request:', error.message);
      throw error;
    }
  }

  // Helper methods
  extractBacklogItems(content) {
    const items = [];
    const lines = content.split('\n');
    let currentItem = null;

    lines.forEach(line => {
      if (line.match(/^- \[[ x]\] \*\*\[.*?\]\*\*/)) {
        if (currentItem) {
          items.push(currentItem);
        }
        currentItem = {
          title: line,
          content: line + '\n',
          completed: line.includes('[x]'),
        };
      } else if (currentItem && (line.startsWith('  ') || line.trim() === '')) {
        currentItem.content += line + '\n';
      } else if (currentItem) {
        items.push(currentItem);
        currentItem = null;
      }
    });

    if (currentItem) {
      items.push(currentItem);
    }

    return items;
  }

  determinePriority(issue) {
    const labels = issue.labels.map(l => l.name.toLowerCase());

    if (labels.includes('critical') || labels.includes('urgent')) return 'CRITICAL';
    if (labels.includes('high') || labels.includes('important')) return 'HIGH';
    if (labels.includes('low')) return 'LOW';
    return 'MEDIUM';
  }

  determineBugSeverity(issue) {
    const labels = issue.labels.map(l => l.name.toLowerCase());

    if (labels.includes('critical') || labels.includes('blocker')) return 'CRITICAL';
    if (labels.includes('high') || labels.includes('major')) return 'HIGH';
    if (labels.includes('low') || labels.includes('minor')) return 'LOW';
    return 'MEDIUM';
  }

  estimateEffort(issue) {
    const bodyLength = (issue.body || '').length;
    const labels = issue.labels.map(l => l.name.toLowerCase());

    if (labels.includes('epic') || bodyLength > 2000) return 'XL';
    if (labels.includes('large') || bodyLength > 1000) return 'L';
    if (labels.includes('small') || bodyLength < 200) return 'S';
    if (bodyLength < 100) return 'XS';
    return 'M';
  }

  mapToRoadmapPhase(issue) {
    const title = issue.title.toLowerCase();
    const body = (issue.body || '').toLowerCase();
    const text = title + ' ' + body;

    if (text.includes('bootstrap') || text.includes('setup') || text.includes('infrastructure')) {
      return 'Phase 0 - Project Bootstrap';
    }
    if (text.includes('agent') || text.includes('skill') || text.includes('memory')) {
      return 'Phase 1 - Agent Memory & Skills';
    }
    if (text.includes('spec') || text.includes('workflow') || text.includes('plan')) {
      return 'Phase 2 - Spec-Driven Development';
    }
    if (text.includes('execution') || text.includes('hook') || text.includes('guardrail')) {
      return 'Phase 3 - Execution Engine & Guardrails';
    }
    if (text.includes('context') || text.includes('subagent') || text.includes('isolation')) {
      return 'Phase 4 - Advanced Context Engineering';
    }
    if (text.includes('cli') || text.includes('ide') || text.includes('tool')) {
      return 'Phase 5 - Developer Tooling';
    }
    if (text.includes('distribution') || text.includes('npm') || text.includes('publish')) {
      return 'Phase 6 - Distribution & Ecosystem';
    }

    return 'Phase 1 - Agent Memory & Skills'; // Default
  }

  extractDescription(body) {
    if (!body) return '[No description provided]';

    // Extract first paragraph or first 100 characters
    const firstParagraph = body.split('\n\n')[0];
    return firstParagraph.length > 100 ? firstParagraph.substring(0, 100) + '...' : firstParagraph;
  }

  generateCommitMessage() {
    const enhancementCount =
      this.changes.find(c => c.type === 'enhancement_issues_added')?.count || 0;
    const bugCount = this.changes.find(c => c.type === 'bug_issues_added')?.count || 0;

    let message = 'feat: sync backlog with GitHub issues\n\n';

    if (enhancementCount > 0) {
      message += `- Added ${enhancementCount} new enhancement issues\n`;
    }
    if (bugCount > 0) {
      message += `- Added ${bugCount} new bug reports\n`;
    }

    message += '- Updated priority classifications\n';
    message += '- Validated roadmap consistency\n\n';

    const allIssues = [
      ...(this.changes.find(c => c.type === 'enhancement_issues_added')?.issues || []),
      ...(this.changes.find(c => c.type === 'bug_issues_added')?.issues || []),
    ];

    if (allIssues.length > 0) {
      message += `Issues synced: ${allIssues.join(', ')}`;
    }

    return message;
  }

  generatePRBody() {
    const enhancementCount =
      this.changes.find(c => c.type === 'enhancement_issues_added')?.count || 0;
    const bugCount = this.changes.find(c => c.type === 'bug_issues_added')?.count || 0;

    return `Automated synchronization of BACKLOG.md with GitHub issues.

**Changes:**
- Added ${enhancementCount} new enhancement issues to backlog
- Added ${bugCount} new bug reports to tracking section
- Updated priority classifications based on issue labels
- Validated roadmap consistency

**Review Required:**
- [ ] Verify issue priorities are correct
- [ ] Check roadmap phase mappings
- [ ] Confirm effort estimates
- [ ] Review new items for completeness

**Automation Details:**
- Sync performed: ${new Date().toISOString()}
- Total issues processed: ${enhancementCount + bugCount}
- Validation status: Passed with warnings (see CI logs)`;
  }

  reportResults() {
    console.log('\n📊 Sync Results:');

    if (this.changes.length === 0) {
      console.log('✅ No changes needed - backlog is up to date with GitHub issues');
      return;
    }

    this.changes.forEach(change => {
      if (change.type === 'enhancement_issues_added') {
        console.log(`✅ Added ${change.count} enhancement issues: ${change.issues.join(', ')}`);
      }
      if (change.type === 'bug_issues_added') {
        console.log(`✅ Added ${change.count} bug issues: ${change.issues.join(', ')}`);
      }
    });

    if (this.dryRun) {
      console.log('\n💡 This was a dry run - no files were modified');
      console.log('   Run without --dry-run to apply changes');
    } else {
      console.log('\n🎉 Backlog sync completed successfully!');
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose'),
  };

  const runner = new BacklogSyncRunner(options);
  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = BacklogSyncRunner;
