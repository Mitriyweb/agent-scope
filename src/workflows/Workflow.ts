import type { Agent } from '@/types/Agent';
import { ExecutionEngine, type ExecutionResult } from '@/execution/ExecutionEngine';

export type WorkflowExecutionPattern = 'sequential' | 'parallel' | 'conditional';

export interface WorkflowStep {
  agentName: string;
  pattern: WorkflowExecutionPattern;
  dependsOn?: string[];
  condition?: (results: Map<string, ExecutionResult>) => boolean;
}

export interface WorkflowDefinition {
  name: string;
  steps: WorkflowStep[];
  agents: Map<string, Agent>;
}

export class Workflow {
  private definition: WorkflowDefinition;
  private engine: ExecutionEngine;
  private results: Map<string, ExecutionResult> = new Map();

  constructor(definition: WorkflowDefinition) {
    this.definition = definition;
    this.engine = new ExecutionEngine();
    this.validateDAG();
  }

  private validateDAG(): void {
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (stepName: string): void => {
      if (visited.has(stepName)) return;
      if (visiting.has(stepName)) {
        throw new Error(`Cycle detected in workflow: ${stepName}`);
      }

      visiting.add(stepName);

      const step = this.definition.steps.find(s => s.agentName === stepName);
      if (step?.dependsOn) {
        for (const dep of step.dependsOn) {
          visit(dep);
        }
      }

      visiting.delete(stepName);
      visited.add(stepName);
    };

    for (const step of this.definition.steps) {
      visit(step.agentName);
    }
  }

  async execute(
    command: string,
    options?: { timeout?: number }
  ): Promise<Map<string, ExecutionResult>> {
    const executed = new Set<string>();

    for (const step of this.definition.steps) {
      // Check dependencies
      if (step.dependsOn) {
        for (const dep of step.dependsOn) {
          if (!executed.has(dep)) {
            throw new Error(`Dependency ${dep} not executed before ${step.agentName}`);
          }
        }
      }

      // Check condition
      if (step.condition && !step.condition(this.results)) {
        continue;
      }

      const agent = this.definition.agents.get(step.agentName);
      if (!agent) {
        throw new Error(`Agent ${step.agentName} not found in workflow`);
      }

      const result = await this.engine.execute(agent, command, options);
      this.results.set(step.agentName, result);
      executed.add(step.agentName);
    }

    return this.results;
  }

  getResults(): Map<string, ExecutionResult> {
    return this.results;
  }

  getResult(agentName: string): ExecutionResult | undefined {
    return this.results.get(agentName);
  }

  getName(): string {
    return this.definition.name;
  }
}
