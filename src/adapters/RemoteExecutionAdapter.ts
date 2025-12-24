import type {
  ExecutionAdapter,
  ExecutionResult,
  ExecutionOptions,
} from '@/adapters/ExecutionAdapter';
import ExecutionStatus from '@/types/ExecutionStatus';

export interface RemoteAdapterConfig {
  endpoint: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class RemoteExecutionAdapter implements ExecutionAdapter {
  name = 'remote';
  private results = new Map<string, ExecutionResult>();

  constructor(private config: RemoteAdapterConfig) {}

  async execute(command: string, options?: ExecutionOptions): Promise<ExecutionResult> {
    const id = Math.random().toString(36).substring(7);
    const startTime = Date.now();

    try {
      const result = await this.executeWithRetry(command, options);
      result.id = id;
      result.timestamp = new Date();
      result.duration = Date.now() - startTime;
      this.results.set(id, result);
      return result;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      const result: ExecutionResult = {
        id,
        status: ExecutionStatus.Failed,
        output: '',
        error: err.message,
        duration: Date.now() - startTime,
        timestamp: new Date(),
        exitCode: 1,
      };
      this.results.set(id, result);
      return result;
    }
  }

  async cancel(executionId: string): Promise<boolean> {
    const result = this.results.get(executionId);
    if (result && result.status === ExecutionStatus.Running) {
      result.status = ExecutionStatus.Cancelled;
      return true;
    }
    return false;
  }

  async getStatus(executionId: string): Promise<ExecutionStatus | undefined> {
    return this.results.get(executionId)?.status;
  }

  private async executeWithRetry(
    command: string,
    options?: ExecutionOptions
  ): Promise<ExecutionResult> {
    const maxRetries = this.config.retries ?? 3;
    const retryDelay = this.config.retryDelay ?? 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(this.config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command, options }),
          signal: AbortSignal.timeout(this.config.timeout ?? 30000),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) as ExecutionResult;
      } catch (error: unknown) {
        if (attempt === maxRetries - 1) {
          throw error instanceof Error ? error : new Error(String(error));
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    throw new Error('Max retries exceeded');
  }
}
