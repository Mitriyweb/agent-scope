import { ExplainAgentCommand } from '@/commands/ExplainAgentCommand';

describe('ExplainAgentCommand', () => {
  it('should display usage when no args', async () => {
    const command = new ExplainAgentCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage'));
    logSpy.mockRestore();
  });

  it('should display agent details', async () => {
    const command = new ExplainAgentCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['analyzer']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Agent'));
    logSpy.mockRestore();
  });

  it('should display capabilities with --capabilities flag', async () => {
    const command = new ExplainAgentCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['analyzer', '--capabilities']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Capabilities'));
    logSpy.mockRestore();
  });

  it('should display agent role', async () => {
    const command = new ExplainAgentCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['analyzer']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Role'));
    logSpy.mockRestore();
  });

  it('should display agent scope', async () => {
    const command = new ExplainAgentCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['analyzer']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Scope'));
    logSpy.mockRestore();
  });

  it('should display agent status', async () => {
    const command = new ExplainAgentCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['analyzer']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Status'));
    logSpy.mockRestore();
  });
});
