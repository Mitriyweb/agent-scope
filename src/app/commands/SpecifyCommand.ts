import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

export class SpecifyCommand {
  static register(program: Command) {
    const specifyCmd = program
      .command('specify [name]')
      .description('Manage specifications (SDD)')
      .action(name => {
        if (!name) {
          // List specs if no name provided
          this.listSpecs();
          return;
        }
        this.createSpec(name);
      });

    specifyCmd
      .command('list')
      .description('List all specifications')
      .action(() => {
        this.listSpecs();
      });

    specifyCmd
      .command('validate [name]')
      .description('Validate specification format (SHALL/MUST, Scenarios)')
      .action(name => {
        if (!name) {
          this.validateAllSpecs();
          return;
        }
        this.validateSpec(name);
      });
  }

  private static listSpecs() {
    const specsDir = path.join(process.cwd(), 'specs');
    if (!fs.existsSync(specsDir)) {
      console.log('No specs/ directory found.');
      return;
    }

    const files = fs.readdirSync(specsDir).filter(f => f.endsWith('.md') && f !== 'template.md');
    if (files.length === 0) {
      console.log('No specifications found.');
      return;
    }

    console.log('Specifications:');
    files.forEach(f => console.log(`- ${f.replace('.md', '')}`));
  }

  private static createSpec(name: string) {
    const specsDir = path.join(process.cwd(), 'specs');
    const templatePath = path.join(specsDir, 'template.md');
    const targetPath = path.join(specsDir, `${name}.md`);

    if (fs.existsSync(targetPath)) {
      console.error(`Specification ${name} already exists.`);
      process.exit(1);
    }

    if (!fs.existsSync(templatePath)) {
      console.error('Template specs/template.md not found. Run infrastructure setup first.');
      process.exit(1);
    }

    let template = fs.readFileSync(templatePath, 'utf-8');
    template = template.replace(/\[Name\]/g, name);

    fs.writeFileSync(targetPath, template);
    console.log(`Created specification: specs/${name}.md`);
  }

  private static validateAllSpecs() {
    const specsDir = path.join(process.cwd(), 'specs');
    if (!fs.existsSync(specsDir)) {
      console.log('No specs/ directory found.');
      return;
    }

    const files = fs.readdirSync(specsDir).filter(f => f.endsWith('.md') && f !== 'template.md');
    let allValid = true;

    console.log('Validating all specifications...');
    files.forEach(f => {
      const valid = this.performValidation(path.join(specsDir, f));
      if (!valid) allValid = false;
    });

    if (allValid) {
      console.log('✅ All specifications passed validation.');
    } else {
      console.error('❌ Some specifications failed validation.');
      process.exit(1);
    }
  }

  private static validateSpec(name: string) {
    const specsDir = path.join(process.cwd(), 'specs');
    const targetPath = path.join(specsDir, `${name}.md`);

    if (!fs.existsSync(targetPath)) {
      console.error(`Specification ${name} not found.`);
      process.exit(1);
    }

    if (this.performValidation(targetPath)) {
      console.log(`✅ Specification ${name} is valid.`);
    } else {
      console.error(`❌ Specification ${name} failed validation.`);
      process.exit(1);
    }
  }

  private static performValidation(filePath: string): boolean {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fileName = path.basename(filePath);
    let valid = true;

    // Check for requirements
    const requirementLineIndices = lines
      .map((line, index) => (line.startsWith('### Requirement:') ? index : -1))
      .filter(index => index !== -1);

    if (requirementLineIndices.length === 0) {
      console.warn(`[${fileName}] Warning: No requirements found.`);
      return true; // Warnings don't fail validation unless strict
    }

    requirementLineIndices.forEach((reqIndex, arrayIndex) => {
      const nextReqIndex =
        arrayIndex < requirementLineIndices.length - 1
          ? requirementLineIndices[arrayIndex + 1]
          : lines.length;

      const reqLines = lines.slice(reqIndex + 1, nextReqIndex);
      const reqTitle = lines[reqIndex].replace('### Requirement:', '').trim();

      let hasShallMust = false;
      let hasScenario = false;

      reqLines.forEach(line => {
        if (line.match(/\b(SHALL|MUST)\b/)) hasShallMust = true;
        if (line.startsWith('#### Scenario:')) hasScenario = true;
      });

      if (!hasShallMust) {
        console.error(
          `[${fileName}] Error: Requirement "${reqTitle}" (line ${reqIndex + 1}) missing SHALL/MUST statement.`
        );
        valid = false;
      }
      if (!hasScenario) {
        console.error(
          `[${fileName}] Error: Requirement "${reqTitle}" (line ${reqIndex + 1}) missing "#### Scenario:".`
        );
        valid = false;
      }
    });

    return valid;
  }
}
