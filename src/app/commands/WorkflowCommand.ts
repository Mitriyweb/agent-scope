import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { Workflow, WorkflowDefinition, WorkflowStep } from '@/workflows/Workflow';
import { ConfigLoader } from '@/utils/ConfigLoader';
import { Agent } from '@/types/Agent';

export class WorkflowCommand {
  static register(program: Command) {
    const workflowCmd = program
      .command('workflow')
      .description('Manage and execute multi-agent workflows');

    workflowCmd
      .command('run <name>')
      .description('Execute a specific workflow')
      .option('--command <cmd>', 'Command to execute in each step', 'Execute implementation')
      .action(async (name, options) => {
        await this.runWorkflow(name, options.command);
      });
  }

  private static async runWorkflow(name: string, command: string) {
    const workflowPath = path.join(process.cwd(), 'ai', 'workflows', `${name}.md`);
    if (!fs.existsSync(workflowPath)) {
      console.error(`❌ Workflow not found: ${workflowPath}`);
      return;
    }

    console.log(`🚀 Loading workflow: ${name}...`);

    // Load agents for context
    const loader = new ConfigLoader();
    const agentConfigs = loader.loadAgents();
    const agents = new Map<string, Agent>();
    agentConfigs.forEach(a => {
      agents.set(a.name, {
        name: a.name,
        role: a.role,
        scope: { patterns: a.scope, readOnly: false },
      });
    });

    // Parse workflow steps from markdown (simplified for now)
    // In a real implementation, we would parse the markdown properly.
    // For this implementation, we'll try to find agent names in the markdown.
    const content = fs.readFileSync(workflowPath, 'utf-8');
    const steps: WorkflowStep[] = [];

    // Simple parsing: look for lines like "1. **Architect** ..." or "- **Developer** ..."
    const agentMatches = content.matchAll(/(?:\d+\.|\-)\s+\*\*([^*]+)\*\*/g);
    for (const match of agentMatches) {
      const agentName = match[1].trim();
      if (agents.has(agentName)) {
        steps.push({
          agentName,
          pattern: 'sequential',
        });
      }
    }

    if (steps.length === 0) {
      console.error(`❌ No valid agents found in workflow markdown: ${name}`);
      return;
    }

    console.log(`Found ${steps.length} steps: ${steps.map(s => s.agentName).join(' -> ')}`);

    const definition: WorkflowDefinition = {
      name,
      steps,
      agents,
    };

    const workflow = new Workflow(definition);
    try {
      await workflow.execute(command);
      console.log(`\n✅ Workflow ${name} completed successfully.`);
    } catch (error) {
      console.error(`\n❌ Workflow execution failed: ${error}`);
      process.exit(1);
    }
  }
}
