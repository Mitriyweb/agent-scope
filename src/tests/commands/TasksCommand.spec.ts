import { TasksCommand } from '@/commands/TasksCommand';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

describe('TasksCommand', () => {
  let program: Command;
  const testDir = path.join(__dirname, 'test-tasks');
  const originalCwd = process.cwd();

  beforeEach(() => {
    program = new Command();
    TasksCommand.register(program);
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

  it('should list changes with tasks', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const changesDir = path.join(testDir, 'openspec', 'changes', 'my-change');
    fs.mkdirSync(changesDir, { recursive: true });
    fs.writeFileSync(path.join(changesDir, 'tasks.md'), '# Tasks\n- [ ] Task 1');

    program.parse(['node', 'test', 'tasks']);

    expect(logSpy).toHaveBeenCalledWith('Active changes with tasks:');
    expect(logSpy).toHaveBeenCalledWith('- my-change');
    logSpy.mockRestore();
  });

  it('should list tasks for a specific change', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const changeId = 'test-change';
    const changesDir = path.join(testDir, 'openspec', 'changes', changeId);
    fs.mkdirSync(changesDir, { recursive: true });
    fs.writeFileSync(path.join(changesDir, 'tasks.md'), '## Header\n- [ ] Task 1\n- [x] Task 2');

    program.parse(['node', 'test', 'tasks', changeId]);

    expect(logSpy).toHaveBeenCalledWith(`Tasks for ${changeId}:`);
    expect(logSpy).toHaveBeenCalledWith('\n## Header');
    expect(logSpy).toHaveBeenCalledWith('- [ ] Task 1');
    expect(logSpy).toHaveBeenCalledWith('- [x] Task 2');
    logSpy.mockRestore();
  });

  it('should list tasks for a specific change via list command', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const changeId = 'test-change';
    const changesDir = path.join(testDir, 'openspec', 'changes', changeId);
    fs.mkdirSync(changesDir, { recursive: true });
    fs.writeFileSync(path.join(changesDir, 'tasks.md'), '# Tasks\n- [ ] Task 1');

    program.parse(['node', 'test', 'tasks', 'list', changeId]);

    expect(logSpy).toHaveBeenCalledWith(`Tasks for ${changeId}:`);
    logSpy.mockRestore();
  });

  it('should list all changes with tasks via list command without args', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const changesDir = path.join(testDir, 'openspec', 'changes', 'my-change');
    fs.mkdirSync(changesDir, { recursive: true });
    fs.writeFileSync(path.join(changesDir, 'tasks.md'), '# Tasks\n- [ ] Task 1');

    program.parse(['node', 'test', 'tasks', 'list']);

    expect(logSpy).toHaveBeenCalledWith('Active changes with tasks:');
    logSpy.mockRestore();
  });

  it('should handle missing openspec/changes directory', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    program.parse(['node', 'test', 'tasks']);
    expect(logSpy).toHaveBeenCalledWith('No openspec/changes/ directory found.');
    logSpy.mockRestore();
  });

  it('should handle no changes with tasks', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.mkdirSync(path.join(testDir, 'openspec', 'changes'), { recursive: true });
    program.parse(['node', 'test', 'tasks']);
    expect(logSpy).toHaveBeenCalledWith('No changes with tasks found.');
    logSpy.mockRestore();
  });

  it('should handle missing tasks file for specific change', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    program.parse(['node', 'test', 'tasks', 'missing-change']);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Tasks file for change missing-change not found')
    );
    errorSpy.mockRestore();
  });

  describe('syncTasks', () => {
    it('should sync task status and update backlog and roadmap', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // 1. Setup change with all completed tasks
      const changeId = 'my-feature';
      const changeDir = path.join(testDir, 'openspec', 'changes', changeId);
      fs.mkdirSync(changeDir, { recursive: true });
      fs.writeFileSync(path.join(changeDir, 'tasks.md'), '- [x] Task 1\n- [x] Task 2');

      // 2. Setup BACKLOG.md with this change
      const backlogContent = `
# Backlog
- [ ] **[HIGH]** My Feature Implementation
  - **Roadmap Phase**: Phase 2 - Spec-Driven Development (SDD)
  - **Roadmap Item**: My Roadmap Goal
  - **OpenSpec Change**: my-feature
`;
      fs.writeFileSync(path.join(testDir, 'BACKLOG.md'), backlogContent);

      // 3. Setup ROADMAP.md
      const roadmapContent = `
## Phase 2 - Spec-Driven Development (SDD)
- [ ] My Roadmap Goal
`;
      fs.writeFileSync(path.join(testDir, 'ROADMAP.md'), roadmapContent);

      // Run sync
      program.parse(['node', 'test', 'tasks', 'sync']);

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('2/2 tasks completed'));
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Marked backlog item as completed')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Marked roadmap item as completed')
      );

      // Verify files
      const updatedBacklog = fs.readFileSync(path.join(testDir, 'BACKLOG.md'), 'utf-8');
      expect(updatedBacklog).toContain('- [x] **[HIGH]** My Feature Implementation');

      const updatedRoadmap = fs.readFileSync(path.join(testDir, 'ROADMAP.md'), 'utf-8');
      expect(updatedRoadmap).toContain('- [x] My Roadmap Goal');

      logSpy.mockRestore();
    });

    it('should not mark backlog item if some tasks are pending', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const changeId = 'pending-feature';
      const changeDir = path.join(testDir, 'openspec', 'changes', changeId);
      fs.mkdirSync(changeDir, { recursive: true });
      fs.writeFileSync(path.join(changeDir, 'tasks.md'), '- [x] Done\n- [ ] Pending');

      const backlogContent = `
  - [ ] **[HIGH]** Pending Feature
    - **OpenSpec Change**: pending-feature
  `;
      fs.writeFileSync(path.join(testDir, 'BACKLOG.md'), backlogContent);

      program.parse(['node', 'test', 'tasks', 'sync']);

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('1/2 tasks completed'));
      const updatedBacklog = fs.readFileSync(path.join(testDir, 'BACKLOG.md'), 'utf-8');
      expect(updatedBacklog).toContain('- [ ] **[HIGH]** Pending Feature');
      logSpy.mockRestore();
    });
  });
});
