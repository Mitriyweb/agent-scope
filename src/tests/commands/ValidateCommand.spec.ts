import { ValidateCommand } from '@/commands/ValidateCommand';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

describe('ValidateCommand', () => {
  let program: Command;
  const testDir = path.join(__dirname, 'test-validate');
  const originalCwd = process.cwd();

  beforeEach(() => {
    program = new Command();
    ValidateCommand.register(program);
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

  it('should pass structure validation when all dirs and templates exist', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Create required structure
    ['specs', 'plans', 'tasks', 'contracts', 'openspec/changes', 'openspec/specs'].forEach(dir => {
      fs.mkdirSync(path.join(testDir, dir), { recursive: true });
    });
    ['specs/template.md', 'plans/template.md'].forEach(template => {
      fs.writeFileSync(path.join(testDir, template), 'content');
    });

    program.parse(['node', 'test', 'validate', 'structure']);

    expect(logSpy).toHaveBeenCalledWith('✅ Structure validation passed.');
    logSpy.mockRestore();
  });

  it('should fail structure validation if a directory is missing', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: string | number | null | undefined): never => {
        throw new Error(`process.exit: ${code}`);
      });

    expect(() => {
      program.parse(['node', 'test', 'validate', 'structure']);
    }).toThrow('process.exit: 1');

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Directory specs/ is missing.'));

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('should fail structure validation if a template is missing', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: string | number | null | undefined): never => {
        throw new Error(`process.exit: ${code}`);
      });

    // Create dirs but no templates
    ['specs', 'plans', 'tasks', 'contracts', 'openspec/changes', 'openspec/specs'].forEach(dir => {
      fs.mkdirSync(path.join(testDir, dir), { recursive: true });
    });

    expect(() => {
      program.parse(['node', 'test', 'validate', 'structure']);
    }).toThrow('process.exit: 1');

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Template specs/template.md is missing.')
    );

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
