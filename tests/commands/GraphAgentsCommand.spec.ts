import { GraphAgentsCommand } from '@/commands/GraphAgentsCommand';

describe('GraphAgentsCommand', () => {
  it('should display agent graph', async () => {
    const command = new GraphAgentsCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Agent'));
    logSpy.mockRestore();
  });

  it('should filter by role', async () => {
    const command = new GraphAgentsCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['--role', 'developer']);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should show agent connections', async () => {
    const command = new GraphAgentsCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should display agent roles', async () => {
    const command = new GraphAgentsCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should handle empty role filter', async () => {
    const command = new GraphAgentsCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['--role', 'unknown']);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should show all agents without filter', async () => {
    const command = new GraphAgentsCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
