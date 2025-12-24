import type { Agent } from '@/types/Agent';
import { ExecutionEngine, type ExecutionResult } from '@/execution/ExecutionEngine';

export interface ConcurrencyOptions {
  maxConcurrent?: number;
  timeout?: number;
}

export class ConcurrentExecutor {
  private engine: ExecutionEngine;
  private running: Set<string> = new Set();
  private maxConcurrent: number;

  constructor(maxConcurrent: number = 4) {
    this.engine = new ExecutionEngine();
    this.maxConcurrent = maxConcurrent;
  }

  async executeMultiple(
    agents: Agent[],
    command: string,
    options?: ConcurrencyOptions
  ): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];
    const queue = [...agents];
    const executing: Promise<void>[] = [];

    const executeNext = async (): Promise<void> => {
      while (queue.length > 0) {
        const agent = queue.shift();
        if (!agent) break;

        this.running.add(agent.name);

        try {
          const result = await this.engine.execute(agent, command, {
            timeout: options?.timeout,
          });
          results.push(result);
        } finally {
          this.running.delete(agent.name);
        }
      }
    };

    // Start concurrent executions
    for (let i = 0; i < Math.min(this.maxConcurrent, agents.length); i++) {
      executing.push(executeNext());
    }

    await Promise.all(executing);
    return results;
  }

  getRunningAgents(): string[] {
    return Array.from(this.running);
  }

  isRunning(agentName: string): boolean {
    return this.running.has(agentName);
  }

  getMaxConcurrent(): number {
    return this.maxConcurrent;
  }

  setMaxConcurrent(max: number): void {
    this.maxConcurrent = Math.max(1, max);
  }
}
