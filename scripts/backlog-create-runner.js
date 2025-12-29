#!/usr/bin/env node

/**
 * Backlog Create Workflow Runner
 * Creates new backlog items with OpenSpec change proposals
 */

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

class BacklogCreateRunner {
  constructor(options = {}) {
    this.interactive = options.interactive || false;
    this.fromIssue = options.fromIssue || false;
    this.quick = options.quick || false;
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;

    // CLI arguments
    this.title = options.title;
    this.userStory = options.userStory;
    this.priority = options.priority;
    this.effort = options.effort;
    this.phase = options.phase;
    this.issueNumber = options.issueNumber;
  }

  async run() {
    console.log('📝 Starting Backlog Create Workflow\n');

    try {
      await this.step1_gatherRequirements();
      await this.step2_mapToRoadmapPhase();
      await this.step3_determineRoadmapItem();
      await this.step4_generateBacklogEntry();
      await this.step5_createOpenSpecChange();
      await this.step6_updateBacklogWithChangeId();
      await this.step7_validateAndReview();

      if (!this.dryRun) {
        await this.step8_createDevelopmentBranch();
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

  async step1_gatherRequirements() {
    console.log('📋 Step 1: Gathering requirements...');

    if (this.fromIssue && this.issueNumber) {
      await this.gatherFromGitHubIssue();
    } else if (this.interactive) {
      await this.gatherInteractively();
    } else if (this.title && this.userStory && this.priority && this.effort) {
      // Requirements already provided via CLI arguments
      console.log('   Using provided CLI arguments');
    } else {
      throw new Error(
        'Missing required arguments. Use --interactive, --from-issue, or provide --title, --user-story, --priority, --effort'
      );
    }

    console.log(`   Title: ${this.title}`);
    console.log(`   Priority: ${this.priority}`);
    console.log(`   Effort: ${this.effort}`);
  }

  async gatherFromGitHubIssue() {
    console.log(`   Fetching GitHub issue #${this.issueNumber}...`);

    try {
      const issueData = execSync(`gh issue view ${this.issueNumber} --json title,body,labels`, {
        encoding: 'utf8',
      });
      const issue = JSON.parse(issueData);

      this.title = issue.title;
      this.userStory = issue.body.split('\n').slice(0, 3).join(' ').trim();

      // Determine priority from labels
      const labels = issue.labels.map(l => l.name.toLowerCase());
      if (labels.includes('critical') || labels.includes('urgent')) {
        this.priority = 'CRITICAL';
      } else if (labels.includes('high') || labels.includes('important')) {
        this.priority = 'HIGH';
      } else if (labels.includes('low')) {
        this.priority = 'LOW';
      } else {
        this.priority = 'MEDIUM';
      }

      // Estimate effort from body length and labels
      const bodyLength = (issue.body || '').length;
      if (labels.includes('epic') || bodyLength > 2000) {
        this.effort = 'XL';
      } else if (labels.includes('large') || bodyLength > 1000) {
        this.effort = 'L';
      } else if (labels.includes('small') || bodyLength < 200) {
        this.effort = 'S';
      } else if (bodyLength < 100) {
        this.effort = 'XS';
      } else {
        this.effort = 'M';
      }

      console.log(`   ✅ Extracted from GitHub issue #${this.issueNumber}`);
    } catch (error) {
      throw new Error(`Failed to fetch GitHub issue: ${error.message}`);
    }
  }

  async gatherInteractively() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = prompt => new Promise(resolve => rl.question(prompt, resolve));

    try {
      this.title = await question('Feature title: ');
      this.userStory = await question('User story (As a... I want... So that...): ');

      console.log('\nPriority levels:');
      console.log('1. CRITICAL - Blocking, urgent fix needed');
      console.log('2. HIGH - Important, should be done soon');
      console.log('3. MEDIUM - Normal priority');
      console.log('4. LOW - Nice to have');
      const priorityChoice = await question('Select priority (1-4): ');
      const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
      this.priority = priorities[parseInt(priorityChoice) - 1] || 'MEDIUM';

      console.log('\nEffort estimates:');
      console.log('1. XS - Few hours');
      console.log('2. S - 1-2 days');
      console.log('3. M - 3-5 days');
      console.log('4. L - 1-2 weeks');
      console.log('5. XL - 2+ weeks');
      const effortChoice = await question('Select effort (1-5): ');
      const efforts = ['XS', 'S', 'M', 'L', 'XL'];
      this.effort = efforts[parseInt(effortChoice) - 1] || 'M';

      console.log('   ✅ Requirements gathered interactively');
    } finally {
      rl.close();
    }
  }

  async step2_mapToRoadmapPhase() {
    console.log('🗺️  Step 2: Mapping to roadmap phase...');

    if (this.phase) {
      // Phase provided via CLI
      this.phaseNumber = this.phase;
    } else if (this.interactive) {
      await this.selectPhaseInteractively();
    } else {
      // Auto-detect phase based on title and description
      this.phaseNumber = this.autoDetectPhase();
    }

    // Validate phase exists in roadmap
    const roadmapContent = fs.readFileSync('ROADMAP.md', 'utf8');
    const phasePattern = new RegExp(`## Phase ${this.phaseNumber} —`);
    const phaseMatch = roadmapContent.match(phasePattern);

    if (!phaseMatch) {
      throw new Error(`Phase ${this.phaseNumber} not found in ROADMAP.md`);
    }

    this.phaseTitle = phaseMatch[0].replace('## ', '');
    console.log(`   ✅ Mapped to: ${this.phaseTitle}`);
  }

  async selectPhaseInteractively() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = prompt => new Promise(resolve => rl.question(prompt, resolve));

    try {
      console.log('\nAvailable roadmap phases:');
      console.log('0. Phase 0 - Project Bootstrap');
      console.log('1. Phase 1 - Agent Memory & Skills');
      console.log('2. Phase 2 - Spec-Driven Development');
      console.log('3. Phase 3 - Execution Engine & Guardrails');
      console.log('4. Phase 4 - Advanced Context Engineering');
      console.log('5. Phase 5 - Developer Tooling');
      console.log('6. Phase 6 - Distribution & Ecosystem');

      const phaseChoice = await question('Select phase (0-6): ');
      this.phaseNumber = phaseChoice;
    } finally {
      rl.close();
    }
  }

  autoDetectPhase() {
    const text = (this.title + ' ' + this.userStory).toLowerCase();

    if (text.includes('bootstrap') || text.includes('setup') || text.includes('infrastructure')) {
      return '0';
    }
    if (text.includes('agent') || text.includes('skill') || text.includes('memory')) {
      return '1';
    }
    if (text.includes('spec') || text.includes('workflow') || text.includes('plan')) {
      return '2';
    }
    if (text.includes('execution') || text.includes('hook') || text.includes('guardrail')) {
      return '3';
    }
    if (text.includes('context') || text.includes('subagent') || text.includes('isolation')) {
      return '4';
    }
    if (text.includes('cli') || text.includes('ide') || text.includes('tool')) {
      return '5';
    }
    if (text.includes('distribution') || text.includes('npm') || text.includes('publish')) {
      return '6';
    }

    return '1'; // Default to Phase 1
  }

  async step3_determineRoadmapItem() {
    console.log('🎯 Step 3: Determining roadmap item mapping...');

    const roadmapContent = fs.readFileSync('ROADMAP.md', 'utf8');

    // Extract phase section
    const phaseStart = roadmapContent.indexOf(`## Phase ${this.phaseNumber} —`);
    const nextPhaseStart = roadmapContent.indexOf(`## Phase ${parseInt(this.phaseNumber) + 1} —`);
    const phaseEnd =
      nextPhaseStart !== -1 ? nextPhaseStart : roadmapContent.indexOf('## Non-goals');

    const phaseSection = roadmapContent.substring(phaseStart, phaseEnd);

    // Extract roadmap items (lines starting with "- [ ]" or "- [x]")
    const roadmapItems = phaseSection.match(/^- \[[ x]\] .+$/gm) || [];

    if (roadmapItems.length === 0) {
      this.roadmapItem = '[To be determined]';
      console.log('   ⚠️  No specific roadmap items found, using placeholder');
    } else {
      // For now, use the first incomplete item or first item
      const incompleteItems = roadmapItems.filter(item => item.includes('[ ]'));
      this.roadmapItem = incompleteItems.length > 0 ? incompleteItems[0] : roadmapItems[0];
      console.log(`   ✅ Mapped to roadmap item: ${this.roadmapItem}`);
    }
  }

  async step4_generateBacklogEntry() {
    console.log('📄 Step 4: Generating backlog entry...');

    // Ensure BACKLOG.md exists
    if (!fs.existsSync('BACKLOG.md')) {
      fs.writeFileSync('BACKLOG.md', '# Backlog\n\n## Backlog\n\n## Completed\n\n');
    }

    const currentDate = new Date().toISOString().split('T')[0];

    this.backlogEntry = `- [ ] **[${this.priority}]** ${this.title}
  - **Roadmap Phase**: ${this.phaseTitle}
  - **Roadmap Item**: ${this.roadmapItem}
  - **Effort**: ${this.effort}
  - **Description**: ${this.userStory}
  - **Acceptance Criteria**:
    - [ ] [To be defined]
  - **Dependencies**: [None identified]
  - **OpenSpec Change**: [To be created]
  - **Created**: ${currentDate}`;

    if (this.issueNumber) {
      this.backlogEntry = this.backlogEntry.replace(
        '  - **Created**:',
        `  - **Issue**: #${this.issueNumber}\n  - **Created**:`
      );
    }

    console.log('   ✅ Backlog entry generated');
  }

  async step5_createOpenSpecChange() {
    console.log('📋 Step 5: Creating OpenSpec change proposal...');

    // Generate change ID
    this.changeId = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if change ID already exists
    if (fs.existsSync(`openspec/changes/${this.changeId}`)) {
      console.log('   ⚠️  Change ID already exists, appending timestamp');
      this.changeId = `${this.changeId}-${Date.now()}`;
    }

    // Create change directory structure
    const changeDir = `openspec/changes/${this.changeId}`;
    if (!this.dryRun) {
      fs.mkdirSync(`${changeDir}/specs`, { recursive: true });
    }

    // Generate proposal document
    const currentDate = new Date().toISOString().split('T')[0];
    const proposalContent = `# Change: ${this.title}

## Why

${this.userStory}

## What Changes

- [Specific changes to be defined during design phase]

## Impact

- **Affected specs**: [To be determined]
- **Affected code**: [To be determined]
- **Priority**: ${this.priority}
- **Estimated effort**: ${this.effort}
- **Roadmap phase**: ${this.phaseTitle}
- **Roadmap item**: ${this.roadmapItem}

## Acceptance Criteria

- [ ] [Criterion 1 - to be defined]
- [ ] [Criterion 2 - to be defined]
- [ ] [Criterion 3 - to be defined]

## Dependencies

- [List any prerequisite changes or features]

## References

- **Backlog item**: ${this.title}
- **Created**: ${currentDate}${this.issueNumber ? `\n- **GitHub issue**: #${this.issueNumber}` : ''}

## Notes

- This proposal was generated from backlog item
- Detailed requirements and design to be added during planning phase
- Follow OpenSpec validation process before implementation`;

    if (!this.dryRun) {
      fs.writeFileSync(`${changeDir}/proposal.md`, proposalContent);
    }

    // Generate tasks document
    const tasksContent = `# Implementation Tasks: ${this.title}

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

- **Effort estimate**: ${this.effort}
- **Priority**: ${this.priority}
- **Roadmap alignment**: ${this.phaseTitle}
- Follow coding standards in \`ai/rules/\`
- Ensure all pre-commit hooks pass
- Reference change ID in commit messages: \`${this.changeId}\`

## Definition of Done

- [ ] All tasks completed and verified
- [ ] Code review completed and approved
- [ ] All tests passing with required coverage
- [ ] Documentation updated and reviewed
- [ ] Feature deployed and working in production
- [ ] Backlog item marked as complete
- [ ] OpenSpec change archived`;

    if (!this.dryRun) {
      fs.writeFileSync(`${changeDir}/tasks.md`, tasksContent);
    }

    console.log(`   ✅ Created OpenSpec change: ${this.changeId}`);
  }

  async step6_updateBacklogWithChangeId() {
    console.log('🔗 Step 6: Updating backlog with change ID...');

    // Update backlog entry with change ID
    this.backlogEntry = this.backlogEntry.replace(
      '  - **OpenSpec Change**: [To be created]',
      `  - **OpenSpec Change**: ${this.changeId}`
    );

    // Add to BACKLOG.md
    let backlogContent = fs.readFileSync('BACKLOG.md', 'utf8');

    // Find insertion point (after ## Backlog header)
    const backlogIndex = backlogContent.indexOf('## Backlog');
    if (backlogIndex === -1) {
      throw new Error('Could not find "## Backlog" section in BACKLOG.md');
    }

    const beforeBacklog = backlogContent.substring(0, backlogIndex + '## Backlog'.length);
    const afterBacklog = backlogContent.substring(backlogIndex + '## Backlog'.length);

    backlogContent = beforeBacklog + '\n\n' + this.backlogEntry + '\n' + afterBacklog;

    if (!this.dryRun) {
      fs.writeFileSync('BACKLOG.md', backlogContent);
    }

    console.log('   ✅ Updated backlog with change ID');
  }

  async step7_validateAndReview() {
    console.log('✅ Step 7: Validating and reviewing...');

    try {
      // Validate backlog-roadmap consistency
      execSync('npm run backlog:validate', { stdio: 'pipe' });
      console.log('   ✅ Backlog validation passed');
    } catch (error) {
      console.warn('   ⚠️  Backlog validation warnings');
      if (this.verbose) {
        console.log(error.stdout?.toString());
      }
    }

    console.log('   ✅ Validation complete');
  }

  async step8_createDevelopmentBranch() {
    console.log('🌿 Step 8: Creating development branch...');

    const branchName = `feature/${this.changeId}`;
    const commitMessage = `feat: add backlog item and OpenSpec change for ${this.title}

- Added backlog item with ${this.priority} priority
- Created OpenSpec change proposal: ${this.changeId}
- Mapped to roadmap: ${this.phaseTitle}
- Estimated effort: ${this.effort}

Change-Id: ${this.changeId}`;

    try {
      execSync(`git checkout -b ${branchName}`, { stdio: 'pipe' });
      execSync(`git add BACKLOG.md openspec/changes/${this.changeId}/`, { stdio: 'pipe' });
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });

      console.log(`   ✅ Created feature branch: ${branchName}`);
      this.branchName = branchName;
    } catch (error) {
      console.error('   ❌ Failed to create development branch:', error.message);
      throw error;
    }
  }

  reportResults() {
    console.log('\n📊 Create Results:');
    console.log(`✅ Created backlog item: ${this.title}`);
    console.log(`✅ Generated OpenSpec change: ${this.changeId}`);
    console.log(`✅ Mapped to roadmap phase: ${this.phaseTitle}`);
    console.log(`✅ Priority: ${this.priority}, Effort: ${this.effort}`);

    if (this.branchName) {
      console.log(`✅ Created development branch: ${this.branchName}`);
    }

    if (this.dryRun) {
      console.log('\n💡 This was a dry run - no files were modified');
      console.log('   Run without --dry-run to apply changes');
    } else {
      console.log('\n🎉 Backlog item creation completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Review the generated backlog item and OpenSpec change');
      console.log('2. Refine acceptance criteria and requirements');
      console.log('3. Begin implementation following the tasks document');
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  const options = {
    interactive: args.includes('--interactive'),
    fromIssue: args.includes('--from-issue'),
    quick: args.includes('--quick'),
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose'),

    // Extract CLI arguments
    title: getArgValue(args, '--title'),
    userStory: getArgValue(args, '--user-story'),
    priority: getArgValue(args, '--priority'),
    effort: getArgValue(args, '--effort'),
    phase: getArgValue(args, '--phase'),
    issueNumber: getArgValue(args, '--issue'),
  };

  function getArgValue(args, flag) {
    const index = args.indexOf(flag);
    return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
  }

  const runner = new BacklogCreateRunner(options);
  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = BacklogCreateRunner;
