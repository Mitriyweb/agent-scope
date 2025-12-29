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
      console.error(`Change ${changeId} not found.`);
      return;
    }

    if (options.planFirst) {
      console.log('--- SDD: Embedded Plan Mode Enabled ---');
      console.log('Requirement: Please create a technical plan in plans/ before modifying code.');
    }

    console.log(`Starting implementation for change: ${changeId}`);
    if (options.task) {
      console.log(`Targeting task: ${options.task}`);
    }
  }
}
