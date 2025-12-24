import { FlowGraphCommand } from '@/commands/FlowGraphCommand';
import * as fs from 'fs';
import * as path from 'path';

describe('FlowGraphCommand', () => {
  let tempFile: string;

  beforeEach(() => {
    tempFile = path.join(__dirname, 'test-flow.json');
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });

  it('should show usage when no args', async () => {
    const command = new FlowGraphCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(logSpy).toHaveBeenCalledWith('Usage: agent-scope flow graph <flow-file>');
    logSpy.mockRestore();
  });

  it('should handle file not found', async () => {
    const command = new FlowGraphCommand();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    await command.execute(['/nonexistent/file.json']);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error generating graph'));
    errorSpy.mockRestore();
  });

  it('should handle invalid JSON', async () => {
    const command = new FlowGraphCommand();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    fs.writeFileSync(tempFile, 'invalid json {');

    await command.execute([tempFile]);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error generating graph'));
    errorSpy.mockRestore();
  });

  it('should display flow graph with nodes and edges', async () => {
    const command = new FlowGraphCommand();
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

    expect(logSpy).toHaveBeenCalledWith('Flow Graph: TestFlow');
    expect(logSpy).toHaveBeenCalledWith('[node1] Agent1');
    expect(logSpy).toHaveBeenCalledWith('[node2] Agent2');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('output'));
    logSpy.mockRestore();
  });

  it('should handle flow with no edges', async () => {
    const command = new FlowGraphCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const flowData = {
      name: 'SimpleFlow',
      version: '1.0.0',
      nodes: {
        node1: { agentName: 'Agent1' },
      },
      edges: [],
    };
    fs.writeFileSync(tempFile, JSON.stringify(flowData));

    await command.execute([tempFile]);

    expect(logSpy).toHaveBeenCalledWith('Flow Graph: SimpleFlow');
    expect(logSpy).toHaveBeenCalledWith('[node1] Agent1');
    logSpy.mockRestore();
  });
});
