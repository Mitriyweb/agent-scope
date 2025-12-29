#!/usr/bin/env node

/**
 * Backlog-Roadmap Consistency Validator
 * Validates that backlog items are properly mapped to roadmap phases
 */

const fs = require('fs');

class BacklogRoadmapValidator {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.errors = [];
    this.warnings = [];
  }

  async validate() {
    console.log('🔍 Validating backlog-roadmap consistency...\n');

    try {
      await this.loadFiles();
      await this.validateBacklogItems();
      await this.validateRoadmapMapping();
      await this.validatePhaseConsistency();

      this.reportResults();
      return this.errors.length === 0;
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
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

    // Extract roadmap phases
    this.roadmapPhases = this.extractRoadmapPhases(this.roadmapContent);

    console.log(`📋 Found ${this.backlogItems.length} backlog items`);
    console.log(`🗺️  Found ${this.roadmapPhases.length} roadmap phases`);
  }

  extractBacklogItems(content) {
    const items = [];
    const lines = content.split('\n');
    let currentItem = null;

    lines.forEach((line, index) => {
      if (line.match(/^- \[[ x]\] \*\*\[.*?\]\*\*/)) {
        if (currentItem) {
          items.push(currentItem);
        }
        currentItem = {
          title: line,
          content: line + '\n',
          completed: line.includes('[x]'),
          lineNumber: index + 1,
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

  extractRoadmapPhases(content) {
    const phases = [];
    const phaseMatches = content.match(/## Phase \d+ [—-][^\n]+/g) || [];

    phaseMatches.forEach(match => {
      const phaseNumber = match.match(/Phase (\d+)/)[1];
      const phaseName = match.replace(/## /, '');
      phases.push({
        number: phaseNumber,
        name: phaseName,
        fullName: phaseName,
      });
    });

    return phases;
  }

  async validateBacklogItems() {
    console.log('🔍 Validating backlog items...');

    this.backlogItems.forEach(item => {
      this.validateBacklogItem(item);
    });

    console.log(`   Checked ${this.backlogItems.length} backlog items`);
  }

  validateBacklogItem(item) {
    const requiredFields = ['Roadmap Phase', 'Roadmap Item', 'Effort', 'Description'];

    // Check required fields
    requiredFields.forEach(field => {
      if (!item.fields[field]) {
        this.errors.push({
          type: 'missing_field',
          item: item.title,
          field: field,
          line: item.lineNumber,
          message: `Missing required field: ${field}`,
        });
      }
    });

    // Validate roadmap phase format
    if (item.fields['Roadmap Phase']) {
      const phaseField = item.fields['Roadmap Phase'];
      if (!phaseField.match(/^Phase \d+ [—-] /)) {
        this.errors.push({
          type: 'invalid_phase_format',
          item: item.title,
          field: 'Roadmap Phase',
          value: phaseField,
          line: item.lineNumber,
          message: `Invalid roadmap phase format. Expected "Phase X - Name" or "Phase X — Name", got "${phaseField}"`,
        });
      }
    }

    // Validate effort scale
    if (item.fields['Effort']) {
      const effort = item.fields['Effort'];
      if (!['XS', 'S', 'M', 'L', 'XL'].includes(effort)) {
        this.errors.push({
          type: 'invalid_effort',
          item: item.title,
          field: 'Effort',
          value: effort,
          line: item.lineNumber,
          message: `Invalid effort value. Expected XS/S/M/L/XL, got "${effort}"`,
        });
      }
    }

    // Check for placeholder values
    Object.entries(item.fields).forEach(([field, value]) => {
      if (value.includes('[To be') || value.includes('[None identified]')) {
        this.warnings.push({
          type: 'placeholder_value',
          item: item.title,
          field: field,
          value: value,
          line: item.lineNumber,
          message: `Placeholder value in ${field}: ${value}`,
        });
      }
    });
  }

  async validateRoadmapMapping() {
    console.log('🗺️  Validating roadmap mapping...');

    this.backlogItems.forEach(item => {
      if (item.fields['Roadmap Phase']) {
        const phaseField = item.fields['Roadmap Phase'];
        const phaseMatch = phaseField.match(/^Phase (\d+)/);

        if (phaseMatch) {
          const phaseNumber = phaseMatch[1];
          const roadmapPhase = this.roadmapPhases.find(p => p.number === phaseNumber);

          if (!roadmapPhase) {
            this.errors.push({
              type: 'orphaned_item',
              item: item.title,
              phase: phaseField,
              line: item.lineNumber,
              message: `Backlog item references non-existent roadmap phase: ${phaseField}`,
            });
          }
        }
      }
    });

    console.log('   Checked roadmap phase mappings');
  }

  async validatePhaseConsistency() {
    console.log('📊 Validating phase consistency...');

    // Check for phases with no backlog items
    this.roadmapPhases.forEach(phase => {
      const itemsInPhase = this.backlogItems.filter(
        item =>
          item.fields['Roadmap Phase'] &&
          item.fields['Roadmap Phase'].includes(`Phase ${phase.number}`)
      );

      if (itemsInPhase.length === 0) {
        this.warnings.push({
          type: 'empty_phase',
          phase: phase.fullName,
          message: `Roadmap phase has no backlog items: ${phase.fullName}`,
        });
      }
    });

    console.log('   Checked phase consistency');
  }

  reportResults() {
    console.log('\n📊 Validation Results:');
    console.log('======================');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All validations passed - backlog is consistent with roadmap');
      return;
    }

    // Report errors
    if (this.errors.length > 0) {
      console.log(`\n❌ ${this.errors.length} Error(s):`);
      this.errors.forEach((error, index) => {
        console.log(`\n${index + 1}. ${error.message}`);
        if (error.item) console.log(`   Item: ${error.item}`);
        if (error.line) console.log(`   Line: ${error.line}`);
        if (error.field) console.log(`   Field: ${error.field}`);
        if (error.value) console.log(`   Value: ${error.value}`);
      });
    }

    // Report warnings
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  ${this.warnings.length} Warning(s):`);
      this.warnings.forEach((warning, index) => {
        console.log(`\n${index + 1}. ${warning.message}`);
        if (warning.item) console.log(`   Item: ${warning.item}`);
        if (warning.line) console.log(`   Line: ${warning.line}`);
        if (warning.field) console.log(`   Field: ${warning.field}`);
        if (warning.value) console.log(`   Value: ${warning.value}`);
      });
    }

    // Summary
    console.log('\n📋 Summary:');
    console.log(`   Backlog items: ${this.backlogItems.length}`);
    console.log(`   Roadmap phases: ${this.roadmapPhases.length}`);
    console.log(`   Errors: ${this.errors.length}`);
    console.log(`   Warnings: ${this.warnings.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ Validation failed - please fix errors before proceeding');
    } else {
      console.log('\n✅ Validation passed with warnings');
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose'),
  };

  const validator = new BacklogRoadmapValidator(options);
  validator.validate().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = BacklogRoadmapValidator;
