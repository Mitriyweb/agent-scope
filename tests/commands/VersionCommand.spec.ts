import { VersionCommand } from '@/commands/VersionCommand';

describe('VersionCommand', (): void => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach((): void => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach((): void => {
    consoleLogSpy.mockRestore();
  });

  it('should implement CommandHandler interface', (): void => {
    const command = new VersionCommand();
    expect(command).toHaveProperty('execute');
    expect(typeof command.execute).toBe('function');
  });

  it('should output version when executed', (): void => {
    const command = new VersionCommand();
    command.execute();

    expect(consoleLogSpy).toHaveBeenCalled();
    const output = consoleLogSpy.mock.calls[0][0];
    expect(output).toContain('agent-scope');
    expect(output).toContain('v');
  });

  it('should output correct version number', (): void => {
    const command = new VersionCommand();
    command.execute();

    const output = consoleLogSpy.mock.calls[0][0];
    expect(output).toBe('agent-scope v0.1.0');
  });
});
