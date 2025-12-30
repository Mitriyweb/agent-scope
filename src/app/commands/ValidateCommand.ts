import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

export class ValidateCommand {
  static register(program: Command) {
    const validateCmd = program
      .command('validate')
      .description('Perform various validations (Backlog, SDD structure, etc.)');

    validateCmd
      .command('structure')
      .description('Verify SDD directory structure and templates')
      .action(() => {
        this.validateStructure();
      });

    validateCmd
      .command('backlog')
      .description('Validate backlog consistency with roadmap')
      .action(() => {
        this.runBacklogValidation();
      });
  }

  private static validateStructure() {
    const requiredDirs = ['specs', 'plans', 'contracts', 'openspec/changes', 'openspec/specs'];
    const requiredTemplates = ['specs/template.md', 'plans/template.md'];
    let allValid = true;

    console.log('🔍 Validating project structure...');

    requiredDirs.forEach(dir => {
      const p = path.join(process.cwd(), dir);
      if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
        console.log(`✅ Directory ${dir}/ exists.`);
      } else {
        console.error(`❌ Directory ${dir}/ is missing.`);
        allValid = false;
      }
    });

    requiredTemplates.forEach(template => {
      const p = path.join(process.cwd(), template);
      if (fs.existsSync(p)) {
        console.log(`✅ Template ${template} exists.`);
      } else {
        console.error(`❌ Template ${template} is missing.`);
        allValid = false;
      }
    });

    if (allValid) {
      console.log('✅ Structure validation passed.');
    } else {
      console.error('❌ Structure validation failed.');
      process.exit(1);
    }
  }

  private static runBacklogValidation() {
    // Simply run the existing script
    const { execSync } = require('child_process');
    try {
      console.log('Running backlog validation...');
      execSync('npm run backlog:validate', { stdio: 'inherit' });
    } catch (e) {
      process.exit(1);
    }
  }
}
