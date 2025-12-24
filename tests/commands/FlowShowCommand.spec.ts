import { FlowShowCommand } from '@/commands/FlowShowCommand';
import * as fs from 'fs';
import * as path from 'path';

describe('FlowShowCommand', () => {
  let tempFile: string;

  beforeEach(() => {
    tempFile = path.join(__dirname, 'test-flow.json');
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });

  it('should display usage when no args', async () => {
    const command = new FlowShowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalledWith('Usage: agent-scope flow show <flow-file>');
    logSpy.mockRestore();
  });

  it('should handle file not found', async () => {
    const command = new FlowShowCommand();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    await command.execute(['/nonexistent/file.json']);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error showing flow'));
    errorSpy.mockRestore();
  });

  it('should handle invalid JSON', async () => {
    const command = new FlowShowCommand();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    fs.writeFileSync(tempFile, 'invalid json {');

    await command.execute([tempFile]);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error showing flow'));
    errorSpy.mockRestore();
  });

  it('should display flow name and version', async () => {
    const command = new FlowShowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const flowData = {
      name: 'TestFlow',
      version: '1.0.0',
      nodes: {
        node1: { agentName: 'Agent1' },
      },
      edges: [],
    };
    fs.writeFileSync(tempFile, JSON.stringify(flowData));

    await command.execute([tempFile]);

    expect(logSpy).toHaveBeenCalledWith('Flow: TestFlow (v1.0.0)');
    logSpy.mockRestore();
  });

  it('should list flow nodes and edges count', async () => {
    const command = new FlowShowCommand();
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

    expect(logSpy).toHaveBeenCalledWith('Nodes: 2');
    expect(logSpy).toHaveBeenCalledWith('Edges: 1');
    expect(logSpy).toHaveBeenCalledWith('  - node1: Agent1');
    expect(logSpy).toHaveBeenCalledWith('  - node2: Agent2');
    logSpy.mockRestore();
  });

  it('should display node inputs', async () => {
    const command = new FlowShowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const flowData = {
      name: 'TestFlow',
      version: '1.0.0',
      nodes: {
        node1: { agentName: 'Agent1', inputs: { data: 'node0' } },
      },
      edges: [],
    };
    fs.writeFileSync(tempFile, JSON.stringify(flowData));

    await command.execute([tempFile]);

    expect(logSpy).toHaveBeenCalledWith('    input: data from node0');
    logSpy.mockRestore();
  });
});
