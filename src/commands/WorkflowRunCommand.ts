import type { Command } from '@/types/Command';
import { AgentRegistry } from '@/agents/AgentRegistry';
import { Workflow, type WorkflowDefinition } from '@/workflows/Workflow';
import fs from 'fs/promises';
import path from 'path';

export class WorkflowRunCommand implements Command {
  name = 'workflow run';
  description = 'Run a workflow';

  async execute(options: Record<string, unknown>): Promise<void> {
    const workflowFile = options.workflow as string | undefined;
    const command = options.command as string | undefined;
    const timeout = options.timeout as number | undefined;

    if (!workflowFile) {
      throw new Error('--workflow is required');
    }

    if (!command) {
      throw new Error('--command is required');
    }

    // Load workflow definition from file
    const workflowPath = path.resolve(workflowFile);
    const workflowContent = await fs.readFile(workflowPath, 'utf-8');
    const workflowDef = JSON.parse(workflowContent) as WorkflowDefinition;

    // Load agents
    const configPath = await AgentRegistry.findConfigFile();
    if (!configPath) {
      throw new Error('agents.json not found. Run "agent-scope init" first.');
    }

    const registry = new AgentRegistry(configPath);
    await registry.load();

    // Build agents map
    const agents = new Map();
    for (const agentName of workflowDef.steps.map(s => s.agentName)) {
      const agent = registry.getAgent(agentName);
      if (!agent) {
        throw new Error(`Agent "${agentName}" not found in configuration`);
      }
      agents.set(agentName, agent);
    }

    // Create and execute workflow
    const workflow = new Workflow({
      ...workflowDef,
      agents,
    });

    console.log(`Running workflow: ${workflow.getName()}`);
    const results = await workflow.execute(command, { timeout });

    console.log(`\nWorkflow completed. Results:`);
    for (const [agentName, result] of results) {
      console.log(`  ${agentName}: ${result.state}`);
    }
  }
}
