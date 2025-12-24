import type { Command } from '@/types/Command';
import { AgentRegistry } from '@/agents/AgentRegistry';

export class AgentListCommand implements Command {
  name = 'agent list';
  description = 'List all agents';

  async execute(): Promise<void> {
    const registry = new AgentRegistry('agents.json');
    try {
      await registry.load();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    const agents = registry.listAgents();

    if (agents.length === 0) {
      console.log('No agents configured');
      return;
    }

    console.log('\nAgents:');
    for (const agent of agents) {
      const patterns = agent.scope.patterns.join(', ');
      const access = agent.scope.readOnly ? 'read-only' : 'read-write';
      console.log(`  ${agent.name}`);
      console.log(`    Role: ${agent.role}`);
      console.log(`    Scope: ${patterns} (${access})`);
    }
  }
}
