import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

export class ClearCommand {
  static register(program: Command) {
    program
      .command('clear')
      .description('Clear agent-scope directories (.agent and .windsurf)')
      .action(() => {
        const baseDir = process.cwd();
        const agentDir = path.join(baseDir, '.agent');
        const windsurfDir = path.join(baseDir, '.windsurf');

        let cleared = false;

        // Remove .agent directory
        if (fs.existsSync(agentDir)) {
          fs.rmSync(agentDir, { recursive: true, force: true });
          console.log('Removed .agent/ directory');
          cleared = true;
        }

        // Remove .windsurf directory
        if (fs.existsSync(windsurfDir)) {
          fs.rmSync(windsurfDir, { recursive: true, force: true });
          console.log('Removed .windsurf/ directory');
          cleared = true;
        }

        if (cleared) {
          console.log('\n✅ Cleared agent-scope directories');
        } else {
          console.log('No agent-scope directories found to clear');
        }
      });
  }
}
