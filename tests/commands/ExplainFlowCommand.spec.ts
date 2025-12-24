import { ExplainFlowCommand } from '@/commands/ExplainFlowCommand';
import * as fs from 'fs';
import * as path from 'path';

describe('ExplainFlowCommand', () => {
  let tempFile: string;

  beforeEach(() => {
    tempFile = path.join(__dirname, 'test-explain-flow.json');
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });

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

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Flow: TestFlow'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Version: 1.0.0'));
    logSpy.mockRestore();
  });

  it('should handle file not found', async () => {
    const command = new ExplainFlowCommand();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    await command.execute(['/nonexistent/file.json']);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error explaining flow'));
    errorSpy.mockRestore();
  });

  it('should display nodes with --nodes flag', async () => {
    const command = new ExplainFlowCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const flowData = {
      name: 'TestFlow',
      version: '1.0.0',
      nodes: {
        node1: { agentName: 'Agent1', inputs: { input1: 'source1' } },
      },
      edges: [],
    };
    fs.writeFileSync(tempFile, JSON.stringify(flowData));

    await command.execute([tempFile, '--nodes']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Nodes:'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Agent1'));
    logSpy.mockRestore();
  });

  it('should display edges with --edges flag', async () => {
    const command = new ExplainFlowCommand();
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

    await command.execute([tempFile, '--edges']);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Edges:'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('node1'));
    logSpy.mockRestore();
  });

  it('should display all info without flags', async () => {
    const command = new ExplainFlowCommand();
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

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Nodes:'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Edges:'));
    logSpy.mockRestore();
  });
});
