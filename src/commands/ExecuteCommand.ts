import type { Command } from '@/types/Command';
import { AgentRegistry } from '@/agents/AgentRegistry';
import { ExecutionEngine } from '@/execution/ExecutionEngine';
import { ContextIsolation } from '@/execution/ContextIsolation';

export class ExecuteCommand implements Command {
  name = 'execute';
  description = 'Execute an agent';

  async execute(options: Record<string, unknown>): Promise<void> {
    const agentName = options.agent as string | undefined;
    const command = options.command as string | undefined;
    const timeout = options.timeout as number | undefined;

    if (!agentName) {
      throw new Error('--agent is required');
    }

    if (!command) {
      throw new Error('--command is required');
    }

    const configPath = await AgentRegistry.findConfigFile();
    if (!configPath) {
      throw new Error('agents.json not found. Run "agent-scope init" first.');
    }

    const registry = new AgentRegistry(configPath);
    await registry.load();

    const agent = registry.getAgent(agentName);
    if (!agent) {
      throw new Error(`Agent "${agentName}" not found`);
    }

    const engine = new ExecutionEngine();
    const isolation = new ContextIsolation();

    try {
      const context = await isolation.createIsolatedContext(agent);
      console.log(`Executing agent: ${agentName}`);

      const result = await engine.execute(agent, command, {
        timeout,
        cwd: context.cwd,
      });

      console.log(`\nExecution completed with state: ${result.state}`);
      if (result.stdout) {
        console.log(`\nStdout:\n${result.stdout}`);
      }
      if (result.stderr) {
        console.log(`\nStderr:\n${result.stderr}`);
      }
      if (result.error) {
        console.log(`\nError: ${result.error.message}`);
      }
    } finally {
      await isolation.cleanup(agentName);
    }
  }
}
