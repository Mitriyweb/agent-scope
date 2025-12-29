import type ExecutionStatus from '@/types/ExecutionStatus';

export interface ExecutionResult {
  id: string;
  status: ExecutionStatus;
  output: string;
  error?: string;
  duration: number;
  timestamp: Date;
  exitCode?: number;
}

export interface ExecutionOptions {
  timeout?: number;
  cwd?: string;
  env?: Record<string, string>;
}

export interface ExecutionAdapter {
  name: string;
  execute(command: string, options?: ExecutionOptions): Promise<ExecutionResult>;
  cancel(executionId: string): Promise<boolean>;
  getStatus(executionId: string): Promise<ExecutionStatus | undefined>;
}
