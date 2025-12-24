import type { CommandType } from '@/enums/CommandType';
import ExecutionStatus from '@/types/ExecutionStatus';

export interface CliOptions {
  command: CommandType | null;
  args: string[];
}

export interface CommandHandler {
  execute(): void;
}

export { ExecutionStatus };
