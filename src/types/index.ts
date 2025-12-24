import type { CommandType } from '@/enums/CommandType';

export interface CliOptions {
  command: CommandType | null;
  args: string[];
}

export interface CommandHandler {
  execute(): void;
}
