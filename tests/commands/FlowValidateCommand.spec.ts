import { FlowValidateCommand } from '@/commands/FlowValidateCommand';
import * as fs from 'fs';
import * as path from 'path';

describe('FlowValidateCommand', () => {
  let tempFile: string;

  beforeEach(() => {
    tempFile = path.join(__dirname, 'test-flow.json');
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });

  it('should show usage when no args provided', async () => {
    const command = new FlowValidateCommand();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await command.execute([]);

    expect(consoleSpy).toHaveBeenCalledWith('Usage: agent-scope flow validate <flow-file>');
    consoleSpy.mockRestore();
  });

  it('should handle file not found', async () => {
    const command = new FlowValidateCommand();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    await command.execute(['/nonexistent/file.json']);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error validating flow'));
    errorSpy.mockRestore();
  });

  it('should handle invalid JSON', async () => {
    const command = new FlowValidateCommand();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    fs.writeFileSync(tempFile, 'invalid json {');

    await command.execute([tempFile]);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error validating flow'));
    errorSpy.mockRestore();
  });

  it('should confirm valid flow', async () => {
    const command = new FlowValidateCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const flowData = {
      name: 'ValidFlow',
      version: '1.0.0',
      nodes: {
        node1: { agentName: 'Agent1' },
        node2: { agentName: 'Agent2', inputs: { output: 'node1' } },
      },
      edges: [{ from: 'node1', to: 'node2', artifact: 'output' }],
    };
    fs.writeFileSync(tempFile, JSON.stringify(flowData));

    await command.execute([tempFile]);

    expect(logSpy).toHaveBeenCalledWith('✅ Flow "ValidFlow" is valid');
    logSpy.mockRestore();
  });

  it('should report validation errors', async () => {
    const command = new FlowValidateCommand();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const flowData = {
      name: 'InvalidFlow',
      version: '1.0.0',
      nodes: {
        node1: { agentName: 'Agent1' },
        node2: { agentName: 'Agent2', inputs: { missing: 'node1' } },
      },
      edges: [{ from: 'node1', to: 'node2', artifact: 'output' }],
    };
    fs.writeFileSync(tempFile, JSON.stringify(flowData));

    await command.execute([tempFile]);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Flow "InvalidFlow" has'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('error(s):'));
    logSpy.mockRestore();
  });

  it('should handle parsing errors gracefully', async () => {
    const command = new FlowValidateCommand();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const flowData = {
      name: 'BadFlow',
      version: '1.0.0',
      nodes: {
        node1: { agentName: '' },
      },
      edges: [],
    };
    fs.writeFileSync(tempFile, JSON.stringify(flowData));

    await command.execute([tempFile]);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error validating flow'));
    errorSpy.mockRestore();
  });
});
