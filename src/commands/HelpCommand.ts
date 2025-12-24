import type { CommandHandler } from '@/types/index';

export class HelpCommand implements CommandHandler {
  execute(): void {
    console.log(`
agent-scope

Usage:
  agent-scope [command] [options]

Commands:
  build             Build agents and flows for distribution
  help              Show this help message
  version           Show version number

Options:
  --help, -h        Show help
  --version, -v     Show version

Build Command:
  agent-scope build
    Compiles agents and flows based on agent-scope.build.json configuration.
    Outputs artifacts to dist/ directory in JSON format.

Examples:
  agent-scope build
  agent-scope --help
  agent-scope --version
`);
  }
}
