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
    fs.mkdirSync(path.join(testDir, 'plans'), { recursive: true });
    fs.writeFileSync(path.join(testDir, 'plans', `${changeId}.md`), 'test plan');

    program.parse(['node', 'test', 'implement', changeId]);

    expect(logSpy).toHaveBeenCalledWith(`✅ Technical plan matched: plans/${changeId}.md`);
    expect(logSpy).toHaveBeenCalledWith(`🚀 Starting implementation for change: ${changeId}`);
    logSpy.mockRestore();
  });

  it('should show targeting task when provided', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const changeId = 'test-change';
    fs.mkdirSync(path.join(testDir, 'openspec', 'changes', changeId), { recursive: true });
    fs.mkdirSync(path.join(testDir, 'plans'), { recursive: true });
    fs.writeFileSync(path.join(testDir, 'plans', `${changeId}.md`), 'test plan');
    fs.writeFileSync(
      path.join(testDir, 'openspec', 'changes', changeId, 'tasks.md'),
      '- [ ] 1.1 Test task'
    );

    program.parse(['node', 'test', 'implement', changeId, '--task', '1.1']);

    expect(logSpy).toHaveBeenCalledWith('✅ Executing task: 1.1');
    logSpy.mockRestore();
  });

  it('should fail if change does not exist', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: string | number | null | undefined): never => {
        throw new Error(`process.exit: ${code}`);
      });

    expect(() => {
      program.parse(['node', 'test', 'implement', 'missing-change']);
    }).toThrow('process.exit: 1');

    expect(errorSpy).toHaveBeenCalledWith(
      '❌ Change missing-change not found in openspec/changes/'
    );

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('should fail if technical plan is missing when plan-first is enabled', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: string | number | null | undefined): never => {
        throw new Error(`process.exit: ${code}`);
      });

    const changeId = 'test-change';
    fs.mkdirSync(path.join(testDir, 'openspec', 'changes', changeId), { recursive: true });

    expect(() => {
      program.parse(['node', 'test', 'implement', changeId, '--plan-first']);
    }).toThrow('process.exit: 1');

    expect(errorSpy).toHaveBeenCalledWith(`❌ Technical plan missing: plans/${changeId}.md`);

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
