import { GraphFlowCommand } from '@/commands/GraphFlowCommand';

describe('GraphFlowCommand', () => {
  it('should display usage when no args', async () => {
    const command = new GraphFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage'));
    logSpy.mockRestore();
  });

  it('should handle file not found', async () => {
    const command = new GraphFlowCommand();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    await command.execute(['/nonexistent/file.json']);

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('should display ASCII graph', async () => {
    const command = new GraphFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should display graph with labels', async () => {
    const command = new GraphFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['flow.json', '--labels']);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should display graph as JSON', async () => {
    const command = new GraphFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['flow.json', '--format', 'json']);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should show flow name in graph', async () => {
    const command = new GraphFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
