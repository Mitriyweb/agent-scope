import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

export class PlanCommand {
  static register(program: Command) {
    const planCmd = program
      .command('plan [name]')
      .description('Manage technical plans (SDD)')
      .action(name => {
        if (!name) {
          this.listPlans();
          return;
        }
        this.createPlan(name);
      });

    planCmd
      .command('list')
      .description('List all plans')
      .action(() => {
        this.listPlans();
      });
  }

  private static listPlans() {
    const plansDir = path.join(process.cwd(), 'plans');
    if (!fs.existsSync(plansDir)) {
      console.log('No plans/ directory found.');
      return;
    }

    const files = fs.readdirSync(plansDir).filter(f => f.endsWith('.md') && f !== 'template.md');
    if (files.length === 0) {
      console.log('No plans found.');
      return;
    }

    console.log('Technical Plans:');
    files.forEach(f => console.log(`- ${f.replace('.md', '')}`));
  }

  private static createPlan(name: string) {
    const plansDir = path.join(process.cwd(), 'plans');
    const templatePath = path.join(plansDir, 'template.md');
    const targetPath = path.join(plansDir, `${name}.md`);

    if (fs.existsSync(targetPath)) {
      console.error(`Plan ${name} already exists.`);
      process.exit(1);
    }

    if (!fs.existsSync(templatePath)) {
      console.error('Template plans/template.md not found.');
      process.exit(1);
    }

    let template = fs.readFileSync(templatePath, 'utf-8');
    template = template.replace(/\[Change Name\]/g, name);

    fs.writeFileSync(targetPath, template);
    console.log(`Created plan: plans/${name}.md`);
  }
}
