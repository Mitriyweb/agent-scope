import { Command } from 'commander';
import { ConfigLoader } from '@/utils/ConfigLoader';
import { Role } from '@/enums/Role';
import { AgentConfig } from '@/types/AgentConfig';

export class AgentCommand {
  static register(program: Command) {
    const agentCmd = program.command('agent').description('Manage agents');

    agentCmd
      .command('list')
      .description('List all configured agents')
      .action(() => {
        const loader = new ConfigLoader();
        const agents = loader.loadAgents();
        const instructions = loader.loadAgentsMd();

        if (agents.length === 0) {
          console.log('No agents configured.');
          return;
        }

        console.table(
          agents.map(a => ({
            Name: a.name,
            Role: a.role,
            Scope: a.scope.join(', '), // Assuming string[]
            Model: a.model ?? 'default',
            HasInstructions: !!instructions[a.role.toLowerCase()] || !!instructions[a.role],
          }))
        );
      });

    agentCmd
      .command('add <name>')
      .description('Add a new agent')
      .requiredOption('--role <role>', 'Agent role')
      .requiredOption('--scope <scope>', 'Comma-separated scope patterns')
      .option('--description <desc>', 'Description', '')
      .option('--model <model>', 'AI Model')
      .action((name, options) => {
        const loader = new ConfigLoader();
        const agents = loader.loadAgents();

        if (agents.find(a => a.name === name)) {
          console.error(`Agent ${name} already exists.`);
          process.exit(1);
        }

        const role = Object.values(Role).find(r => r === options.role);
        if (!role) {
          console.error(
            `Invalid role: ${options.role}. Available: ${Object.values(Role).join(', ')}`
          );
          process.exit(1);
        }

        const newAgent: AgentConfig = {
          name,
          role,
          description: options.description,
          scope: options.scope.split(',').map((s: string) => s.trim()),
          model: options.model,
        };

        agents.push(newAgent);
        loader.saveAgents(agents);
        console.log(`Agent ${name} added successfully.`);
      });
  }
}
