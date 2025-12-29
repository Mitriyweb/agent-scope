import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import type { Agent } from '@/types/Agent';

export type ExecutionState = 'pending' | 'running' | 'completed' | 'failed';

export interface ExecutionResult {
  agentName: string;
  state: ExecutionState;
  exitCode?: number;
  stdout: string;
  stderr: string;
  startTime: Date;
  endTime?: Date;
  error?: Error;
}

export class ExecutionEngine extends EventEmitter {
  private executions: Map<string, ChildProcess> = new Map();
  private results: Map<string, ExecutionResult> = new Map();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  async execute(
    agent: Agent,
    command: string,
    options?: { timeout?: number; cwd?: string }
  ): Promise<ExecutionResult> {
    const executionId = `${agent.name}-${Date.now()}`;
    const result: ExecutionResult = {
      agentName: agent.name,
      state: 'pending',
      stdout: '',
      stderr: '',
      startTime: new Date(),
    };

    try {
      result.state = 'running';
      this.emit('execution:start', { agentName: agent.name, executionId });

      const childProcess = spawn('sh', ['-c', command], {
        cwd: options?.cwd ?? process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      this.executions.set(executionId, childProcess);

      // Capture stdout and stderr
      childProcess.stdout?.on('data', (data: Buffer | string) => {
        result.stdout += data.toString();
        this.emit('execution:output', { executionId, type: 'stdout', data: data.toString() });
      });

      childProcess.stderr?.on('data', (data: Buffer) => {
        result.stderr += data.toString();
        this.emit('execution:output', { executionId, type: 'stderr', data: data.toString() });
      });

      // Set timeout if specified
      if (options?.timeout) {
        const timeoutHandle = setTimeout(() => {
          childProcess.kill('SIGTERM');
          result.state = 'failed';
          result.error = new Error(`Execution timeout after ${options.timeout}ms`);
          this.emit('execution:timeout', { executionId, agentName: agent.name });
        }, options.timeout);

        this.timeouts.set(executionId, timeoutHandle);
      }

      // Wait for process to complete
      await new Promise<void>((resolve, reject) => {
        childProcess.on('close', (code: number | null) => {
          result.exitCode = code ?? 1;
          result.state = code === 0 ? 'completed' : 'failed';
          result.endTime = new Date();

          if (code !== 0) {
            result.error = new Error(`Process exited with code ${code}`);
          }

          this.emit('execution:end', { executionId, agentName: agent.name, exitCode: code });
          resolve();
        });

        childProcess.on('error', (error: Error) => {
          result.state = 'failed';
          result.error = error;
          result.endTime = new Date();
          this.emit('execution:error', { executionId, agentName: agent.name, error });
          reject(error);
        });
      });
    } catch (error) {
      result.state = 'failed';
      result.error = error instanceof Error ? error : new Error(String(error));
      result.endTime = new Date();
      this.emit('execution:error', { executionId, agentName: agent.name, error });
    } finally {
      // Cleanup
      this.executions.delete(executionId);
      const timeout = this.timeouts.get(executionId);
      if (timeout) {
        clearTimeout(timeout);
        this.timeouts.delete(executionId);
      }
      this.results.set(executionId, result);
    }

    return result;
  }

  cancel(executionId: string): boolean {
    const process = this.executions.get(executionId);
    if (!process) {
      return false;
    }

    process.kill('SIGTERM');
    this.emit('execution:cancelled', { executionId });
    return true;
  }

  getResult(executionId: string): ExecutionResult | undefined {
    return this.results.get(executionId);
  }

  getAllResults(): ExecutionResult[] {
    return Array.from(this.results.values());
  }

  clearResults(): void {
    this.results.clear();
  }
}
