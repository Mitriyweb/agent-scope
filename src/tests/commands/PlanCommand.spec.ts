import { PlanCommand } from '@/commands/PlanCommand';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

describe('PlanCommand', () => {
  let program: Command;
  const testDir = path.join(__dirname, 'test-plan');
  const originalCwd = process.cwd();

  beforeEach(() => {
    program = new Command();
    PlanCommand.register(program);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(path.join(testDir, 'plans'), { recursive: true });
    // Create a template file for testing
    fs.writeFileSync(
      path.join(testDir, 'plans', 'template.md'),
      '# Plan: [Change Name]\nDetails...'
    );
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should create a new plan from template', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    program.parse(['node', 'test', 'plan', 'NewFeaturePlan']);

    expect(fs.existsSync(path.join(testDir, 'plans', 'NewFeaturePlan.md'))).toBe(true);
    const content = fs.readFileSync(path.join(testDir, 'plans', 'NewFeaturePlan.md'), 'utf-8');
    expect(content).toContain('# Plan: NewFeaturePlan');
    expect(logSpy).toHaveBeenCalledWith('Created plan: plans/NewFeaturePlan.md');

    logSpy.mockRestore();
  });

  it('should list plans', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.writeFileSync(path.join(testDir, 'plans', 'PlanA.md'), 'content');
    fs.writeFileSync(path.join(testDir, 'plans', 'PlanB.md'), 'content');

    program.parse(['node', 'test', 'plan', 'list']);

    expect(logSpy).toHaveBeenCalledWith('Technical Plans:');
    expect(logSpy).toHaveBeenCalledWith('- PlanA');
    expect(logSpy).toHaveBeenCalledWith('- PlanB');

    logSpy.mockRestore();
  });

  it('should handle missing plans directory for list', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.rmSync(path.join(testDir, 'plans'), { recursive: true });

    program.parse(['node', 'test', 'plan']);

    expect(logSpy).toHaveBeenCalledWith('No plans/ directory found.');
    logSpy.mockRestore();
  });

  it('should handle empty plans directory for list', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.rmSync(path.join(testDir, 'plans', 'template.md'));

    program.parse(['node', 'test', 'plan']);

    expect(logSpy).toHaveBeenCalledWith('No plans found.');
    logSpy.mockRestore();
  });

  it('should list plans via list command', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.writeFileSync(path.join(testDir, 'plans', 'PlanA.md'), 'content');

    program.parse(['node', 'test', 'plan', 'list']);

    expect(logSpy).toHaveBeenCalledWith('Technical Plans:');
    expect(logSpy).toHaveBeenCalledWith('- PlanA');
    logSpy.mockRestore();
  });

  it('should fail if plan already exists', () => {
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: string | number | null | undefined): never => {
        throw new Error(`process.exit: ${code}`);
      });
    fs.writeFileSync(path.join(testDir, 'plans', 'ExistingPlan.md'), 'content');

    expect(() => {
      program.parse(['node', 'test', 'plan', 'ExistingPlan']);
    }).toThrow('process.exit: 1');

    exitSpy.mockRestore();
  });

  it('should fail if template is missing', () => {
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: string | number | null | undefined): never => {
        throw new Error(`process.exit: ${code}`);
      });
    fs.rmSync(path.join(testDir, 'plans', 'template.md'));

    expect(() => {
      program.parse(['node', 'test', 'plan', 'NewPlan']);
    }).toThrow('process.exit: 1');

    exitSpy.mockRestore();
  });
});
