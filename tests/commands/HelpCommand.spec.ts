import { HelpCommand } from '@/commands/HelpCommand';

describe('HelpCommand', (): void => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach((): void => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach((): void => {
    consoleLogSpy.mockRestore();
  });

  it('should implement CommandHandler interface', (): void => {
    const command = new HelpCommand();
    expect(command).toHaveProperty('execute');
    expect(typeof command.execute).toBe('function');
  });

  it('should output help message when executed', (): void => {
    const command = new HelpCommand();
    command.execute();

    expect(consoleLogSpy).toHaveBeenCalled();
    const output = consoleLogSpy.mock.calls[0][0];
    expect(output).toContain('agent-scope');
    expect(output).toContain('Usage:');
    expect(output).toContain('Commands:');
  });

  it('should include help and version commands in output', (): void => {
    const command = new HelpCommand();
    command.execute();

    const output = consoleLogSpy.mock.calls[0][0];
    expect(output).toContain('help');
    expect(output).toContain('version');
  });
});
