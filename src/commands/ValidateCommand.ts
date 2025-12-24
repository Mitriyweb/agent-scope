import type { Command } from '@/types/Command';
import { AgentRegistry } from '@/agents/AgentRegistry';
import { AgentValidationError } from '@/agents/validateAgent';

export class ValidateCommand implements Command {
  name = 'validate';
  description = 'Validate configuration';

  async execute(): Promise<void> {
    const registry = new AgentRegistry('agents.json');

    try {
      await registry.load();
      const agents = registry.listAgents();
      console.log(`✓ Configuration valid (${agents.length} agents)`);
    } catch (error) {
      if (error instanceof AgentValidationError) {
        throw new Error(`Validation failed: ${error.message}`);
      }
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error('agents.json not found. Run "agent-scope init" first');
      }
      throw error;
    }
  }
}
