import type { CliOptions } from '@/types/index';
import { CommandType } from '@/enums/CommandType';
import { HelpCommand } from '@/commands/HelpCommand';
import { VersionCommand } from '@/commands/VersionCommand';
import { BuildCommand } from '@/commands/BuildCommand';

function normalizeCommand(rawCommand: string | undefined): CommandType | null {
  if (!rawCommand) {
    return null;
  }

  switch (rawCommand) {
    case CommandType.Help:
    case '--help':
    case '-h':
      return CommandType.Help;
    case CommandType.Version:
    case '--version':
    case '-v':
      return CommandType.Version;
    case CommandType.Build:
    case 'build':
      return CommandType.Build;
    default:
      return null;
  }
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const rawCommand = args[0];
  const command = normalizeCommand(rawCommand);

  return {
    command,
    args,
  };
}

function getCommandHandler(command: CommandType | null): void {
  if (!command || command === CommandType.Help) {
    new HelpCommand().execute();
    process.exit(0);
  }

  if (command === CommandType.Version) {
    new VersionCommand().execute();
    process.exit(0);
  }

  if (command === CommandType.Build) {
    new BuildCommand().execute();
    process.exit(0);
  }

  console.error(`Unknown command: ${command}`);
  console.error(`Run 'agent-scope --help' for usage information.`);
  process.exit(1);
}

function main(): void {
  const options = parseArgs();
  getCommandHandler(options.command);
}

main();
