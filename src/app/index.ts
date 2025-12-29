import { Command } from 'commander';
import { InitCommand } from '@/commands/InitCommand';
import { AgentCommand } from '@/commands/AgentCommand';
import { SkillCommand } from '@/commands/SkillCommand';
import { version } from '../../package.json';

const program = new Command();

program
  .name('agent-scope')
  .description('CLI tool for configuring and orchestrating AI agents')
  .version(version);

InitCommand.register(program);
AgentCommand.register(program);
SkillCommand.register(program);

// If being run directly
if (require.main === module) {
  program.parse(process.argv);
}

export { program };
