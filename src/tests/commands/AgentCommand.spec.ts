import { AgentCommand } from '@/commands/AgentCommand';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigLoader } from '@/utils/ConfigLoader';
import { Role } from '@/enums/Role';

describe('AgentCommand', () => {
  let program: Command;
  const testDir = path.join(__dirname, 'test-agent-cmd');
  const originalCwd = process.cwd();

  beforeEach(() => {
    program = new Command();
    AgentCommand.register(program);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
    process.chdir(testDir);
    // Ensure .agent-scope exists for ConfigLoader
    fs.mkdirSync(path.join(testDir, '.agent-scope'));
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should add an agent', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    program.parse([
      'node',
      'test',
      'agent',
      'add',
      'new-agent',
      '--role',
      'developer',
      '--scope',
      'src/**',
    ]);

    const loader = new ConfigLoader(testDir);
    const agents = loader.loadAgents();
    expect(agents).toHaveLength(1);
    expect(agents[0].name).toBe('new-agent');
    expect(agents[0].role).toBe('developer');

    logSpy.mockRestore();
  });

  it('should list agents', () => {
    const logSpy = jest.spyOn(console, 'table').mockImplementation(() => {});
    const loader = new ConfigLoader(testDir);
    loader.saveAgents([
      {
        name: 'existing-agent',
        role: Role.Developer,
        description: '',
        scope: ['src'],
      },
    ]);

    program.parse(['node', 'test', 'agent', 'list']);

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should show message when listing empty agents', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    program.parse(['node', 'test', 'agent', 'list']);

    expect(logSpy).toHaveBeenCalledWith('No agents configured.');
    logSpy.mockRestore();
  });

  it('should fail when adding duplicate agent', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {}) as never);

    const loader = new ConfigLoader(testDir);
    loader.saveAgents([
      {
        name: 'existing-agent',
        role: Role.Developer,
        description: '',
        scope: ['src'],
      },
    ]);

    program.parse([
      'node',
      'test',
      'agent',
      'add',
      'existing-agent',
      '--role',
      'developer',
      '--scope',
      'src/**',
    ]);

    expect(errorSpy).toHaveBeenCalledWith('Agent existing-agent already exists.');
    expect(exitSpy).toHaveBeenCalledWith(1);

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('should fail when adding agent with invalid role', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {}) as never);

    program.parse([
      'node',
      'test',
      'agent',
      'add',
      'new-agent',
      '--role',
      'invalid-role',
      '--scope',
      'src/**',
    ]);

    expect(errorSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
