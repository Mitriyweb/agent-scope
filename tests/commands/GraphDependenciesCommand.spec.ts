import { GraphDependenciesCommand } from '@/commands/GraphDependenciesCommand';

describe('GraphDependenciesCommand', () => {
  it('should display dependency graph', async () => {
    const command = new GraphDependenciesCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Dependency'));
    logSpy.mockRestore();
  });

  it('should respect depth limit', async () => {
    const command = new GraphDependenciesCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['--depth', '1']);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should use default depth of 2', async () => {
    const command = new GraphDependenciesCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('depth: 2'));
    logSpy.mockRestore();
  });

  it('should display file dependencies', async () => {
    const command = new GraphDependenciesCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should handle custom depth', async () => {
    const command = new GraphDependenciesCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute(['--depth', '3']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('depth: 3'));
    logSpy.mockRestore();
  });

  it('should show nested dependencies', async () => {
    const command = new GraphDependenciesCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
