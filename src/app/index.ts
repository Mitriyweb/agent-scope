import { Command } from 'commander';
import { InitCommand } from '@/commands/InitCommand';
import { AgentCommand } from '@/commands/AgentCommand';
import { SkillCommand } from '@/commands/SkillCommand';
import { SpecifyCommand } from '@/commands/SpecifyCommand';
import { PlanCommand } from '@/commands/PlanCommand';
import { TasksCommand } from '@/commands/TasksCommand';
import { ImplementCommand } from '@/commands/ImplementCommand';
import { ValidateCommand } from '@/commands/ValidateCommand';
import { version } from '../../package.json';

const program = new Command();

program
  .name('agent-scope')
  .description('CLI tool for configuring and orchestrating AI agents')
  .version(version);

InitCommand.register(program);
AgentCommand.register(program);
SkillCommand.register(program);
SpecifyCommand.register(program);
PlanCommand.register(program);
TasksCommand.register(program);
ImplementCommand.register(program);
ValidateCommand.register(program);

// If being run directly
if (require.main === module) {
  program.parse(process.argv);
}

export { program };
