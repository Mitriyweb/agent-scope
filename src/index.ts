import type { CliOptions } from '@/types/index';
import { CommandType } from '@/enums/CommandType';
import { HelpCommand } from '@/commands/HelpCommand';
import { VersionCommand } from '@/commands/VersionCommand';
import { BuildCommand } from '@/commands/BuildCommand';
import { ExecuteCommand } from '@/commands/ExecuteCommand';
import { InitCommand } from '@/commands/InitCommand';

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
    case CommandType.Execute:
    case 'execute':
      return CommandType.Execute;
    case CommandType.Init:
    case 'init':
      return CommandType.Init;
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

async function getCommandHandler(command: CommandType | null): Promise<void> {
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

  if (command === CommandType.Execute) {
    const args = process.argv.slice(2);
    const options: Record<string, unknown> = {};
    for (let i = 1; i < args.length; i += 2) {
      const key = args[i]?.replace(/^--/, '');
      const value = args[i + 1];
      if (key && value) {
        options[key] = value;
      }
    }
    await new ExecuteCommand().execute(options);
    process.exit(0);
  }

  if (command === CommandType.Init) {
    await new InitCommand().execute();
    process.exit(0);
  }

  console.error(`Unknown command: ${command}`);
  console.error(`Run 'agent-scope --help' for usage information.`);
  process.exit(1);
}

async function main(): Promise<void> {
  const options = parseArgs();
  await getCommandHandler(options.command);
}

main();
