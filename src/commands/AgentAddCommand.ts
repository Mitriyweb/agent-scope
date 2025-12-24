import type { Command } from '@/types/Command';
import type { Agent } from '@/types/Agent';
import { Role } from '@/enums/Role';
import { AgentRegistry } from '@/agents/AgentRegistry';
import { AgentValidationError } from '@/agents/validateAgent';

export class AgentAddCommand implements Command {
  name = 'agent add';
  description = 'Add new agent';

  async execute(options: Record<string, unknown>): Promise<void> {
    const name = options.name as string | undefined;
    const role = options.role as string | undefined;
    const patterns = (options.patterns as string[] | undefined) ?? ['src/**'];
    const readOnly = (options['read-only'] as boolean | undefined) ?? false;

    if (!name) {
      throw new Error('--name is required');
    }

    if (!role) {
      throw new Error('--role is required');
    }

    const validRoles = Object.values(Role);
    if (!validRoles.includes(role as Role)) {
      throw new Error(`Invalid role "${role}". Valid roles: ${validRoles.join(', ')}`);
    }

    const agent: Agent = {
      name,
      role: role as Role,
      scope: {
        patterns,
        readOnly,
      },
    };

    const registry = new AgentRegistry('agents.json');
    try {
      await registry.load();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    try {
      registry.addAgent(agent);
      await registry.save();
      console.log(`✓ Added agent "${name}" with role "${role}"`);
    } catch (error) {
      if (error instanceof AgentValidationError) {
        throw new Error(`Failed to add agent: ${error.message}`);
      }
      throw error;
    }
  }
}
