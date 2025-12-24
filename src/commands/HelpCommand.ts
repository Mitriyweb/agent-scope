import type { CommandHandler } from '@/types/index';

export class HelpCommand implements CommandHandler {
  execute(): void {
    console.log(`
agent-scope

Usage:
  agent-scope [command] [options]

Commands:
  help              Show this help message
  version           Show version number

Options:
  --help, -h        Show help
  --version, -v     Show version

Examples:
  agent-scope --help
  agent-scope --version
`);
  }
}
