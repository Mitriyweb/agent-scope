import ExecutionStatus from '@/types/ExecutionStatus';

export interface CommandHandler {
  execute(): void;
}

export { ExecutionStatus };
