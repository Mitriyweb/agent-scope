import { execSync } from 'child_process';
import type {
  ExecutionAdapter,
  ExecutionResult,
  ExecutionOptions,
} from '@/adapters/ExecutionAdapter';
import ExecutionStatus from '@/types/ExecutionStatus';

export class LocalExecutionAdapter implements ExecutionAdapter {
  name = 'local';
  private executions = new Map<string, NodeJS.Timeout>();
  private results = new Map<string, ExecutionResult>();

  async execute(command: string, options?: ExecutionOptions): Promise<ExecutionResult> {
    const id = Math.random().toString(36).substring(7);
    const startTime = Date.now();

    try {
      const output = execSync(command, {
        cwd: options?.cwd,
        env: { ...process.env, ...options?.env },
        timeout: options?.timeout,
      }).toString();

      const result: ExecutionResult = {
        id,
        status: ExecutionStatus.Success,
        output,
        duration: Date.now() - startTime,
        timestamp: new Date(),
        exitCode: 0,
      };

      this.results.set(id, result);
      return result;
    } catch (error: unknown) {
      const err = error as {
        message: string;
        killed?: boolean;
        status?: number;
        stdout?: Buffer;
      };
      const result: ExecutionResult = {
        id,
        status: err.killed ? ExecutionStatus.Timeout : ExecutionStatus.Failed,
        output: err.stdout?.toString() ?? '',
        error: err.message,
        duration: Date.now() - startTime,
        timestamp: new Date(),
        exitCode: err.status ?? 1,
      };

      this.results.set(id, result);
      return result;
    }
  }

  async cancel(executionId: string): Promise<boolean> {
    const timeout = this.executions.get(executionId);
    if (timeout) {
      clearTimeout(timeout);
      this.executions.delete(executionId);
      return true;
    }
    return false;
  }

  async getStatus(executionId: string): Promise<ExecutionStatus | undefined> {
    return this.results.get(executionId)?.status;
  }
}
