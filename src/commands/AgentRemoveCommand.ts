import type { Command } from '@/types/Command';
import { AgentRegistry } from '@/agents/AgentRegistry';

export class AgentRemoveCommand implements Command {
  name = 'agent remove';
  description = 'Remove agent';

  async execute(options: Record<string, unknown>): Promise<void> {
    const name = options.name as string | undefined;

    if (!name) {
      throw new Error('--name is required');
    }

    const registry = new AgentRegistry('agents.json');
    try {
      await registry.load();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    if (!registry.hasAgent(name)) {
      throw new Error(`Agent "${name}" not found`);
    }

    registry.removeAgent(name);
    await registry.save();
    console.log(`✓ Removed agent "${name}"`);
  }
}
