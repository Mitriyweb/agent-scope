import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

export class ImplementCommand {
  static register(program: Command) {
    program
      .command('implement <changeId>')
      .description('Execute implementation for a specific change (SDD)')
      .option('--task <taskId>', 'Execute a specific task')
      .option('--plan-first', 'Enforce Embedded Plan Mode', true)
      .action((changeId, options) => {
        this.runImplementation(changeId, options);
      });
  }

  private static runImplementation(
    changeId: string,
    options: { planFirst: boolean; task?: string }
  ) {
    const changeDir = path.join(process.cwd(), 'openspec', 'changes', changeId);
    if (!fs.existsSync(changeDir)) {
      console.error(`❌ Change ${changeId} not found in openspec/changes/`);
      process.exit(1);
    }

    // Requirement: Implementation Safety
    if (options.planFirst) {
      const planPath = path.join(process.cwd(), 'plans', `${changeId}.md`);
      if (!fs.existsSync(planPath)) {
        console.error(`❌ Technical plan missing: plans/${changeId}.md`);
        console.error(
          'Requirement: Implementation SHALL NOT proceed without an approved technical plan.'
        );
        process.exit(1);
      }
      console.log(`✅ Technical plan matched: plans/${changeId}.md`);
    }

    // Requirement: Task Verification
    const tasksPath = path.join(changeDir, 'tasks.md');
    if (options.task) {
      if (!fs.existsSync(tasksPath)) {
        console.error(`❌ Tasks file missing: ${changeId}/tasks.md`);
        process.exit(1);
      }
      const tasksContent = fs.readFileSync(tasksPath, 'utf-8');
      const taskPattern = new RegExp(`^\\s*-\\s*\\[[ x]\\]\\s*${options.task}\\s`, 'm');
      if (!tasksContent.match(taskPattern)) {
        console.error(`❌ Task ${options.task} not found in ${changeId}/tasks.md`);
        process.exit(1);
      }
      console.log(`✅ Executing task: ${options.task}`);
    }

    console.log(`🚀 Starting implementation for change: ${changeId}`);
  }
}
