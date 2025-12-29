import { ImplementCommand } from '@/commands/ImplementCommand';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

describe('ImplementCommand', () => {
  let program: Command;
  const testDir = path.join(__dirname, 'test-implement');
  const originalCwd = process.cwd();

  beforeEach(() => {
    program = new Command();
    ImplementCommand.register(program);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should run implementation for existing change', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const changeId = 'test-change';
    fs.mkdirSync(path.join(testDir, 'openspec', 'changes', changeId), { recursive: true });

    program.parse(['node', 'test', 'implement', changeId]);

    expect(logSpy).toHaveBeenCalledWith('--- SDD: Embedded Plan Mode Enabled ---');
    expect(logSpy).toHaveBeenCalledWith(`Starting implementation for change: ${changeId}`);
    logSpy.mockRestore();
  });

  it('should show targeting task when provided', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const changeId = 'test-change';
    fs.mkdirSync(path.join(testDir, 'openspec', 'changes', changeId), { recursive: true });

    program.parse(['node', 'test', 'implement', changeId, '--task', '1.1']);

    expect(logSpy).toHaveBeenCalledWith('Targeting task: 1.1');
    logSpy.mockRestore();
  });

  it('should fail if change does not exist', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    program.parse(['node', 'test', 'implement', 'missing-change']);
    expect(errorSpy).toHaveBeenCalledWith('Change missing-change not found.');
    errorSpy.mockRestore();
  });
});
