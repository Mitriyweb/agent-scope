import type { Command } from '@/types/Command';
import { AgentRegistry } from '@/agents/AgentRegistry';

export class InitCommand implements Command {
  name = 'init';
  description = 'Initialize project configuration';

  async execute(): Promise<void> {
    const registry = new AgentRegistry('agents.json');
    await registry.save();
    console.log('✓ Initialized agents.json');
  }
}
