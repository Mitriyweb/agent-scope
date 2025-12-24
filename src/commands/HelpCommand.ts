import type { CommandHandler } from '@/types/index';

export class HelpCommand implements CommandHandler {
  execute(): void {
    console.log(`
agent-scope

Usage:
  agent-scope [command] [options]

Commands:
  init              Initialize project configuration
  build             Build agents and flows for distribution
  execute           Execute an agent with isolated context
  help              Show this help message
  version           Show version number

Options:
  --help, -h        Show help
  --version, -v     Show version

Examples:
  agent-scope init
  agent-scope build
  agent-scope execute --agent <name> --command <cmd>
  agent-scope --help
  agent-scope --version
`);
  }
}
