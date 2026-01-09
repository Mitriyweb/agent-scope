import { SkillCommand } from '@/commands/SkillCommand';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

describe('SkillCommand', () => {
  let program: Command;
  const testDir = path.join(__dirname, 'test-skill-cmd');
  const originalCwd = process.cwd();

  beforeEach(() => {
    program = new Command();
    SkillCommand.register(program);
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

  it('should add a skill', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    program.parse(['node', 'test', 'skill', 'add', 'my-skill']);

    const skillPath = path.join(testDir, '.agent', 'skills', 'my-skill.md');
    expect(fs.existsSync(skillPath)).toBe(true);
    expect(fs.readFileSync(skillPath, 'utf-8')).toContain('name: my-skill');

    logSpy.mockRestore();
  });
  it('should fail if skill already exists', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {}) as never);
    const skillPath = path.join(testDir, '.agent', 'skills', 'my-skill.md');
    fs.mkdirSync(path.dirname(skillPath), { recursive: true });
    fs.writeFileSync(skillPath, 'exists');

    const skillName = 'my-skill';
    program.parse(['node', 'test', 'skill', 'add', skillName]);

    expect(errorSpy).toHaveBeenCalledWith(`Skill ${skillName} already exists.`);
    expect(exitSpy).toHaveBeenCalledWith(1);
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
