import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

export class TasksCommand {
  static register(program: Command) {
    const tasksCmd = program
      .command('tasks [changeId]')
      .description('Manage implementation tasks (SDD)')
      .action(changeId => {
        if (!changeId) {
          this.listChangesWithTasks();
          return;
        }
        this.listTasks(changeId);
      });

    tasksCmd
      .command('list [changeId]')
      .description('List tasks for a specific change')
      .action(changeId => {
        if (!changeId) {
          this.listChangesWithTasks();
          return;
        }
        this.listTasks(changeId);
      });

    tasksCmd
      .command('sync')
      .description('Sync task status from openspec/changes to BACKLOG.md and ROADMAP.md')
      .action(() => {
        this.syncTasks();
      });
  }

  private static syncTasks() {
    console.log('🔄 Syncing task status...');
    const changesDir = path.join(process.cwd(), 'openspec', 'changes');
    if (!fs.existsSync(changesDir)) return;

    const changes = fs.readdirSync(changesDir);
    const changeStatus = new Map<string, boolean>();

    changes.forEach(changeId => {
      const tasksPath = path.join(changesDir, changeId, 'tasks.md');
      if (fs.existsSync(tasksPath)) {
        const content = fs.readFileSync(tasksPath, 'utf-8');
        const tasks = content.match(/^\s*-\s*\[[ x]\]/gm) ?? [];
        const completed = content.match(/^\s*-\s*\[x\]/gm) ?? [];
        const allDone = tasks.length > 0 && tasks.length === completed.length;
        changeStatus.set(changeId, allDone);

        if (tasks.length > 0) {
          console.log(`- ${changeId}: ${completed.length}/${tasks.length} tasks completed`);
        }
      }
    });

    this.updateBacklog(changeStatus);
    this.updateRoadmapFromBacklog();
  }

  private static updateBacklog(changeStatus: Map<string, boolean>) {
    const backlogPath = path.join(process.cwd(), 'BACKLOG.md');
    if (!fs.existsSync(backlogPath)) return;

    let content = fs.readFileSync(backlogPath, 'utf-8');
    const lines = content.split('\n');
    let updated = false;

    let currentItemStart = -1;
    let currentChangeId: string | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.match(/^- \[[ x]\] \*\*\[.*?\]\*\*/)) {
        currentItemStart = i;
        currentChangeId = null;
      } else if (currentItemStart !== -1) {
        const changeIdMatch = line.match(/^\s*- \*\*OpenSpec Change\*\*:\s*([^\s]+)$/);
        if (changeIdMatch) {
          currentChangeId = changeIdMatch[1];
          if (changeStatus.has(currentChangeId) && changeStatus.get(currentChangeId)) {
            // Mark as completed in BACKLOG.md
            const itemLine = lines[currentItemStart];
            if (itemLine.includes('- [ ]')) {
              lines[currentItemStart] = itemLine.replace('- [ ]', '- [x]');
              updated = true;
              console.log(
                `✅ Marked backlog item as completed: ${itemLine.match(/\*\*\[.*?\]\*\* (.*)/)?.[1] ?? 'Unknown'}`
              );
            }
          }
        }
        if (line.trim() === '' && i > currentItemStart + 1) {
          currentItemStart = -1;
        }
      }
    }

    if (updated) {
      fs.writeFileSync(backlogPath, lines.join('\n'));
    }
  }

  private static updateRoadmapFromBacklog() {
    const backlogPath = path.join(process.cwd(), 'BACKLOG.md');
    const roadmapPath = path.join(process.cwd(), 'ROADMAP.md');
    if (!fs.existsSync(backlogPath) || !fs.existsSync(roadmapPath)) return;

    const backlogContent = fs.readFileSync(backlogPath, 'utf-8');
    const roadmapContent = fs.readFileSync(roadmapPath, 'utf-8');
    const roadmapLines = roadmapContent.split('\n');
    let updated = false;

    // Simple mapping: if a roadmap item string (excluding checkbox) is found in BACKLOG.md
    // and that backlog item is [x], then mark roadmap item [x].

    // 1. Find all completed items in backlog
    const completedBacklogItems = backlogContent
      .split('\n')
      .filter(l => l.match(/^- \[x\] \*\*\[.*?\]\*\*/));

    completedBacklogItems.forEach(itemLine => {
      // Find "Roadmap Item" field for this item
      const itemIndex = backlogContent.split('\n').indexOf(itemLine);
      let roadmapItemName: string | null = null;
      for (
        let j = itemIndex + 1;
        j < itemIndex + 10 && j < backlogContent.split('\n').length;
        j++
      ) {
        const line = backlogContent.split('\n')[j];
        const match = line.match(/^\s*- \*\*Roadmap Item\*\*:\s*(.*)$/);
        if (match) {
          roadmapItemName = match[1].trim();
          // Strip leading dash and brackets if present in the field value
          roadmapItemName = roadmapItemName.replace(/^- \[[ x]\]\s*/, '').trim();
          break;
        }
        if (line.match(/^- \[[ x]\]/)) break;
      }

      if (roadmapItemName) {
        for (let k = 0; k < roadmapLines.length; k++) {
          if (roadmapLines[k].includes(roadmapItemName) && roadmapLines[k].includes('- [ ]')) {
            roadmapLines[k] = roadmapLines[k].replace('- [ ]', '- [x]');
            updated = true;
            console.log(`✅ Marked roadmap item as completed: ${roadmapItemName}`);
          }
        }
      }
    });

    if (updated) {
      fs.writeFileSync(roadmapPath, roadmapLines.join('\n'));
    }
  }

  private static listChangesWithTasks() {
    const changesDir = path.join(process.cwd(), 'openspec', 'changes');
    if (!fs.existsSync(changesDir)) {
      console.log('No openspec/changes/ directory found.');
      return;
    }

    const changes = fs.readdirSync(changesDir).filter(f => {
      const p = path.join(changesDir, f, 'tasks.md');
      return fs.existsSync(p);
    });

    if (changes.length === 0) {
      console.log('No changes with tasks found.');
      return;
    }

    console.log('Active changes with tasks:');
    changes.forEach(c => console.log(`- ${c}`));
  }

  private static listTasks(changeId: string) {
    const tasksPath = path.join(process.cwd(), 'openspec', 'changes', changeId, 'tasks.md');
    if (!fs.existsSync(tasksPath)) {
      console.error(`Tasks file for change ${changeId} not found at ${tasksPath}`);
      return;
    }

    const content = fs.readFileSync(tasksPath, 'utf-8');
    const lines = content.split('\n');

    console.log(`Tasks for ${changeId}:`);
    lines.forEach(line => {
      if (line.match(/^\s*-\s*\[[ x]\]/)) {
        console.log(line.trim());
      } else if (line.match(/^##\s+/)) {
        console.log(`\n${line.trim()}`);
      }
    });
  }
}
