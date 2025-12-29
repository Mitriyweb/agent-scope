#!/usr/bin/env node

/**
 * Roadmap Status Synchronizer
 * Updates roadmap status based on backlog completion
 */

const fs = require('fs');

class RoadmapStatusSyncer {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.changes = [];
  }

  async sync() {
    console.log('🔄 Synchronizing roadmap status with backlog completion...\n');

    try {
      await this.loadFiles();
      await this.analyzeCompletion();
      await this.updateRoadmapStatus();

      this.reportResults();
      return true;
    } catch (error) {
      console.error('❌ Sync failed:', error.message);
      if (this.verbose) {
        console.error(error.stack);
      }
      return false;
    }
  }

  async loadFiles() {
    // Load BACKLOG.md
    if (!fs.existsSync('BACKLOG.md')) {
      throw new Error('BACKLOG.md not found');
    }
    this.backlogContent = fs.readFileSync('BACKLOG.md', 'utf8');

    // Load ROADMAP.md
    if (!fs.existsSync('ROADMAP.md')) {
      throw new Error('ROADMAP.md not found');
    }
    this.roadmapContent = fs.readFileSync('ROADMAP.md', 'utf8');

    // Extract backlog items
    this.backlogItems = this.extractBacklogItems(this.backlogContent);

    console.log(`📋 Loaded ${this.backlogItems.length} backlog items`);
  }

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
          fields: {},
        };
      } else if (currentItem && (line.startsWith('  ') || line.trim() === '')) {
        currentItem.content += line + '\n';

        // Extract field values
        const fieldMatch = line.match(/^\s*- \*\*([^*]+)\*\*:\s*(.+)$/);
        if (fieldMatch) {
          const [, fieldName, fieldValue] = fieldMatch;
          currentItem.fields[fieldName] = fieldValue.trim();
        }
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

  async analyzeCompletion() {
    console.log('📊 Analyzing completion status...');

    // Group backlog items by roadmap phase
    this.phaseCompletion = {};

    this.backlogItems.forEach(item => {
      if (item.fields['Roadmap Phase']) {
        const phaseField = item.fields['Roadmap Phase'];
        const phaseMatch = phaseField.match(/^(Phase \d+ - [^)]+)/);

        if (phaseMatch) {
          const phaseName = phaseMatch[1];

          if (!this.phaseCompletion[phaseName]) {
            this.phaseCompletion[phaseName] = {
              total: 0,
              completed: 0,
              items: [],
            };
          }

          this.phaseCompletion[phaseName].total++;
          this.phaseCompletion[phaseName].items.push(item);

          if (item.completed) {
            this.phaseCompletion[phaseName].completed++;
          }
        }
      }
    });

    // Calculate completion percentages
    Object.keys(this.phaseCompletion).forEach(phase => {
      const data = this.phaseCompletion[phase];
      data.percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
      data.status = this.determinePhaseStatus(data.percentage, data.completed, data.total);
    });

    console.log('   Analyzed completion for', Object.keys(this.phaseCompletion).length, 'phases');
  }

  determinePhaseStatus(percentage, completed, total) {
    if (percentage === 100) {
      return '✅ COMPLETE';
    } else if (percentage > 0) {
      return '🚧 IN PROGRESS';
    } else if (total > 0) {
      return '📋 PLANNED';
    } else {
      return '📋 PLANNED';
    }
  }

  async updateRoadmapStatus() {
    console.log('🗺️  Updating roadmap status...');

    let updatedContent = this.roadmapContent;
    let changesMade = false;

    // Update phase headers
    Object.keys(this.phaseCompletion).forEach(phaseName => {
      const data = this.phaseCompletion[phaseName];

      // Find phase header in roadmap
      const phaseHeaderRegex = new RegExp(
        `## (${phaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?:\\s+[✅🚧📋⏸️❌]\\s+\\w+)?`,
        'g'
      );
      const currentHeader = updatedContent.match(phaseHeaderRegex);

      if (currentHeader) {
        const newHeader = `## ${phaseName} ${data.status}`;
        updatedContent = updatedContent.replace(phaseHeaderRegex, newHeader);

        this.changes.push({
          type: 'phase_status_updated',
          phase: phaseName,
          oldStatus: currentHeader[0],
          newStatus: newHeader,
          completion: `${data.completed}/${data.total} (${data.percentage}%)`,
        });

        changesMade = true;
      }
    });

    // Update individual roadmap items based on backlog completion
    // This is more complex and would require mapping specific backlog items to roadmap items
    // For now, we'll focus on phase-level status updates

    if (changesMade && !this.dryRun) {
      fs.writeFileSync('ROADMAP.md', updatedContent);
      console.log('   ✅ Roadmap status updated');
    } else if (changesMade && this.dryRun) {
      console.log('   💡 Roadmap status would be updated (dry run)');
    } else {
      console.log('   ℹ️  No roadmap status changes needed');
    }
  }

  reportResults() {
    console.log('\n📊 Sync Results:');
    console.log('=================');

    if (this.changes.length === 0) {
      console.log('✅ No status changes needed - roadmap is up to date');
      return;
    }

    console.log(`📈 Updated ${this.changes.length} phase status(es):`);

    this.changes.forEach(change => {
      if (change.type === 'phase_status_updated') {
        console.log(`\n🔄 ${change.phase}`);
        console.log(`   Status: ${change.newStatus.split(' ').slice(-2).join(' ')}`);
        console.log(`   Progress: ${change.completion}`);
      }
    });

    // Show detailed completion breakdown
    console.log('\n📋 Phase Completion Summary:');
    Object.keys(this.phaseCompletion).forEach(phase => {
      const data = this.phaseCompletion[phase];
      console.log(`\n${phase} ${data.status}`);
      console.log(`   Progress: ${data.completed}/${data.total} items (${data.percentage}%)`);

      if (this.verbose && data.items.length > 0) {
        console.log('   Items:');
        data.items.forEach(item => {
          const status = item.completed ? '✅' : '⏳';
          const title = item.title.replace(/^- \[[ x]\] \*\*\[.*?\]\*\* /, '');
          console.log(`     ${status} ${title}`);
        });
      }
    });

    if (this.dryRun) {
      console.log('\n💡 This was a dry run - no files were modified');
      console.log('   Run without --dry-run to apply changes');
    } else {
      console.log('\n🎉 Roadmap status sync completed successfully!');
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

  const syncer = new RoadmapStatusSyncer(options);
  syncer.sync().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = RoadmapStatusSyncer;
