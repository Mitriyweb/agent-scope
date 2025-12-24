export interface Command {
  name: string;
  description: string;
  execute(options?: Record<string, unknown>): Promise<void>;
}
