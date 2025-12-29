import { InitCommand } from '@/commands/InitCommand';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

describe('InitCommand', () => {
  let program: Command;
  const testDir = path.join(__dirname, 'test-init');
  const originalCwd = process.cwd();

  beforeEach(() => {
    program = new Command();
    InitCommand.register(program);
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

  it('should create .agent-scope directory and AGENTS.md', () => {
    // Mock console.log to avoid noise
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    program.parse(['node', 'test', 'init']);

    expect(fs.existsSync(path.join(testDir, '.agent-scope'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, '.agent-scope', 'AGENTS.md'))).toBe(true);
    const content = fs.readFileSync(path.join(testDir, '.agent-scope', 'AGENTS.md'), 'utf-8');
    expect(content).toContain('<!-- AGENT-SCOPE:START -->');
    expect(content).toContain('<!-- AGENT-SCOPE:END -->');
    expect(logSpy).toHaveBeenCalledWith('Created .agent-scope/ directory');
    expect(logSpy).toHaveBeenCalledWith('Created AGENTS.md');

    logSpy.mockRestore();
  });

  it('should not overwrite existing files but prepend instructions', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.mkdirSync(path.join(testDir, '.agent-scope'));
    fs.writeFileSync(path.join(testDir, '.agent-scope', 'AGENTS.md'), '## Custom\nCustom Rule\n');

    program.parse(['node', 'test', 'init']);

    const content = fs.readFileSync(path.join(testDir, '.agent-scope', 'AGENTS.md'), 'utf-8');
    expect(content).toContain('<!-- AGENT-SCOPE:START -->');
    expect(content).toContain('## Custom');
    expect(content).toContain('## Developer');
    expect(content).toContain('## QA');
    expect(logSpy).toHaveBeenCalledWith('.agent-scope/ directory already exists');
    expect(logSpy).toHaveBeenCalledWith('AGENTS.md already exists');
    expect(logSpy).toHaveBeenCalledWith('Added missing roles to AGENTS.md: Developer, QA');

    logSpy.mockRestore();
  });

  it('should update instructions if block already exists', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.mkdirSync(path.join(testDir, '.agent-scope'));
    const oldContent =
      '<!-- AGENT-SCOPE:START -->\nOld Instructions\n<!-- AGENT-SCOPE:END -->\n\n## Developer\nRole body\n\n## QA\nQA body\n';
    fs.writeFileSync(path.join(testDir, '.agent-scope', 'AGENTS.md'), oldContent);

    program.parse(['node', 'test', 'init']);

    const content = fs.readFileSync(path.join(testDir, '.agent-scope', 'AGENTS.md'), 'utf-8');
    expect(content).toContain('<!-- AGENT-SCOPE:START -->');
    expect(content).not.toContain('Old Instructions');
    expect(content).toContain('Follow project guidelines for agent behavior.');
    expect(content).toContain('## Developer');
    expect(logSpy).toHaveBeenCalledWith('AGENTS.md updated with latest instructions.');

    logSpy.mockRestore();
  });

  it('should migrate root AGENTS.md to .agent-scope/AGENTS.md', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.writeFileSync(path.join(testDir, 'AGENTS.md'), '## Legacy\nLegacy rule\n');

    program.parse(['node', 'test', 'init']);

    expect(fs.existsSync(path.join(testDir, '.agent-scope', 'AGENTS.md'))).toBe(true);
    const content = fs.readFileSync(path.join(testDir, '.agent-scope', 'AGENTS.md'), 'utf-8');
    expect(content).toContain('## Legacy');
    expect(content).toContain('<!-- AGENT-SCOPE:START -->');
    expect(logSpy).toHaveBeenCalledWith('Migrated root AGENTS.md to .agent-scope/AGENTS.md');

    logSpy.mockRestore();
  });

  it('should use OPENSPEC markers and pointer instructions if openspec/ exists', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.mkdirSync(path.join(testDir, 'openspec'));

    program.parse(['node', 'test', 'init']);

    const content = fs.readFileSync(path.join(testDir, '.agent-scope', 'AGENTS.md'), 'utf-8');
    expect(content).toContain('<!-- OPENSPEC:START -->');
    expect(content).toContain('Always open `@/openspec/AGENTS.md`');
    expect(logSpy).toHaveBeenCalledWith('Created AGENTS.md');

    logSpy.mockRestore();
  });

  it('should copy recursively from ai directory', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const aiDir = path.join(testDir, 'ai');
    const subDir = path.join(aiDir, 'sub');
    fs.mkdirSync(subDir, { recursive: true });
    fs.writeFileSync(path.join(aiDir, 'file1.txt'), 'content1');
    fs.writeFileSync(path.join(subDir, 'file2.txt'), 'content2');

    program.parse(['node', 'test', 'init']);

    expect(fs.existsSync(path.join(testDir, '.agent-scope', 'file1.txt'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, '.agent-scope', 'sub', 'file2.txt'))).toBe(true);
    expect(logSpy).toHaveBeenCalledWith('Migrating existing ai/ directory rules to .agent-scope/');

    logSpy.mockRestore();
  });

  it('should not overwrite existing files during migration', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const aiDir = path.join(testDir, 'ai');
    fs.mkdirSync(aiDir);
    fs.writeFileSync(path.join(aiDir, 'config.json'), 'new');

    const agentScopeDir = path.join(testDir, '.agent-scope');
    fs.mkdirSync(agentScopeDir);
    const existingFile = path.join(agentScopeDir, 'config.json');
    fs.writeFileSync(existingFile, 'old');

    program.parse(['node', 'test', 'init']);

    expect(fs.readFileSync(existingFile, 'utf-8')).toBe('old');

    logSpy.mockRestore();
  });
});
