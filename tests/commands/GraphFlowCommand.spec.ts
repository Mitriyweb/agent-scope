import { GraphFlowCommand } from '@/commands/GraphFlowCommand';
import * as fs from 'fs';
import * as path from 'path';

describe('GraphFlowCommand', () => {
  let tempFile: string;

  beforeEach(() => {
    tempFile = path.join(__dirname, 'test-graph-flow.json');
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });

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

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error generating graph'));
    errorSpy.mockRestore();
  });

  it('should display ASCII graph', async () => {
    const command = new GraphFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const flowData = {
      name: 'TestFlow',
      version: '1.0.0',
      nodes: {
        node1: { agentName: 'Agent1' },
        node2: { agentName: 'Agent2' },
      },
      edges: [{ from: 'node1', to: 'node2', artifact: 'output' }],
    };
    fs.writeFileSync(tempFile, JSON.stringify(flowData));

    await command.execute([tempFile]);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Flow: TestFlow'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[node1]'));
    logSpy.mockRestore();
  });

  it('should display graph with labels', async () => {
    const command = new GraphFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const flowData = {
      name: 'TestFlow',
      version: '1.0.0',
      nodes: {
        node1: { agentName: 'Agent1' },
        node2: { agentName: 'Agent2' },
      },
      edges: [{ from: 'node1', to: 'node2', artifact: 'output' }],
    };
    fs.writeFileSync(tempFile, JSON.stringify(flowData));

    await command.execute([tempFile, '--labels']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('output'));
    logSpy.mockRestore();
  });

  it('should display graph as JSON', async () => {
    const command = new GraphFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const flowData = {
      name: 'TestFlow',
      version: '1.0.0',
      nodes: {
        node1: { agentName: 'Agent1' },
        node2: { agentName: 'Agent2' },
      },
      edges: [{ from: 'node1', to: 'node2', artifact: 'output' }],
    };
    fs.writeFileSync(tempFile, JSON.stringify(flowData));

    await command.execute([tempFile, '--format', 'json']);

    expect(logSpy).toHaveBeenCalled();
    const calls = logSpy.mock.calls;
    const jsonOutput = calls.map(c => c[0]).join('');
    expect(jsonOutput).toContain('TestFlow');
    logSpy.mockRestore();
  });

  it('should show flow name in graph', async () => {
    const command = new GraphFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const flowData = {
      name: 'MyFlow',
      version: '1.0.0',
      nodes: {
        node1: { agentName: 'Agent1' },
      },
      edges: [],
    };
    fs.writeFileSync(tempFile, JSON.stringify(flowData));

    await command.execute([tempFile]);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('MyFlow'));
    logSpy.mockRestore();
  });
});
