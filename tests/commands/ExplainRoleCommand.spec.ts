import { ExplainRoleCommand } from '@/commands/ExplainRoleCommand';

describe('ExplainRoleCommand', () => {
  it('should display usage when no args', async () => {
    const command = new ExplainRoleCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage'));
    logSpy.mockRestore();
  });

  it('should display role details', async () => {
    const command = new ExplainRoleCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['developer']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Role'));
    logSpy.mockRestore();
  });

  it('should display agents with --agents flag', async () => {
    const command = new ExplainRoleCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['developer', '--agents']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Agents'));
    logSpy.mockRestore();
  });

  it('should handle unknown role', async () => {
    const command = new ExplainRoleCommand();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    await command.execute(['unknown-role']);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown role'));
    errorSpy.mockRestore();
  });

  it('should display role description', async () => {
    const command = new ExplainRoleCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['developer']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Description'));
    logSpy.mockRestore();
  });

  it('should display role responsibilities', async () => {
    const command = new ExplainRoleCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['developer']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Responsibilities'));
    logSpy.mockRestore();
  });
});
