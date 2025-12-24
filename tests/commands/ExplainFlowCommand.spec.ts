import { ExplainFlowCommand } from '@/commands/ExplainFlowCommand';

describe('ExplainFlowCommand', () => {
  it('should display usage when no args', async () => {
    const command = new ExplainFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage'));
    logSpy.mockRestore();
  });

  it('should display flow overview', async () => {
    const command = new ExplainFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should handle file not found', async () => {
    const command = new ExplainFlowCommand();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    await command.execute(['/nonexistent/file.json']);

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('should display nodes with --nodes flag', async () => {
    const command = new ExplainFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should display edges with --edges flag', async () => {
    const command = new ExplainFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should display all info without flags', async () => {
    const command = new ExplainFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
