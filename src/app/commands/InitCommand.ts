import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

export class InitCommand {
  static register(program: Command) {
    program
      .command('init')
      .description('Initialize agent-scope project')
      .action(() => {
        const baseDir = process.cwd();
        const agentScopeDir = path.join(baseDir, '.agent-scope');
        const agentsMdPath = path.join(agentScopeDir, 'AGENTS.md');
        const rootAgentsMdPath = path.join(baseDir, 'AGENTS.md');

        if (!fs.existsSync(agentScopeDir)) {
          fs.mkdirSync(agentScopeDir, { recursive: true });
          console.log('Created .agent-scope/ directory');
        } else {
          console.log('.agent-scope/ directory already exists');
        }

        // Migrate existing root AGENTS.md if .agent-scope/AGENTS.md doesn't exist
        if (fs.existsSync(rootAgentsMdPath) && !fs.existsSync(agentsMdPath)) {
          fs.copyFileSync(rootAgentsMdPath, agentsMdPath);
          console.log('Migrated root AGENTS.md to .agent-scope/AGENTS.md');
        }

        // Migrate existing ai/ directory if it exists and .agent-scope is new/empty
        const oldAiDir = path.join(baseDir, 'ai');
        if (fs.existsSync(oldAiDir)) {
          console.log('Migrating existing ai/ directory rules to .agent-scope/');
          this.copyRecursiveSync(oldAiDir, agentScopeDir);
        }

        const openspecDir = path.join(baseDir, 'openspec');
        const hasOpenSpec = fs.existsSync(openspecDir);

        const managedStart = hasOpenSpec ? '<!-- OPENSPEC:START -->' : '<!-- AGENT-SCOPE:START -->';
        const managedEnd = hasOpenSpec ? '<!-- OPENSPEC:END -->' : '<!-- AGENT-SCOPE:END -->';

        let instructions = '';
        if (hasOpenSpec) {
          instructions = `${managedStart}

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open \`@/openspec/AGENTS.md\` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use \`@/openspec/AGENTS.md\` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

${managedEnd}`;
        } else {
          instructions = `${managedStart}
# Agent-Scope Instructions

These instructions are for AI assistants working in this project.

- Use \`AGENTS.md\` to learn how to create and manage agent roles.
- Follow project guidelines for agent behavior.

Keep this managed block for automated updates.
${managedEnd}`;
        }

        if (!fs.existsSync(agentsMdPath)) {
          const template = `${instructions}

## Developer
You are a developer. You can read and write code.

## QA
You are a QA engineer. You test the code.\n`;
          fs.writeFileSync(agentsMdPath, template);
          console.log('Created AGENTS.md');
        } else {
          console.log('AGENTS.md already exists');
          let content = fs.readFileSync(agentsMdPath, 'utf-8');

          // Detect existing markers to preserve them
          const currentStart = content.includes('<!-- OPENSPEC:START -->')
            ? '<!-- OPENSPEC:START -->'
            : content.includes('<!-- AGENT-SCOPE:START -->')
              ? '<!-- AGENT-SCOPE:START -->'
              : managedStart;
          const currentEnd =
            currentStart === '<!-- OPENSPEC:START -->'
              ? '<!-- OPENSPEC:END -->'
              : '<!-- AGENT-SCOPE:END -->';

          // 1. Manage the instruction block
          if (content.includes(currentStart)) {
            const regex = new RegExp(
              `${currentStart.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}[\\s\\S]*?${currentEnd.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}`,
              'g'
            );
            content = content.replace(regex, instructions);
          } else {
            content = instructions + '\n\n' + content.trimStart();
          }

          // 2. Ensure default roles exist if not already there
          const rolesToEnsure = [
            {
              name: 'Developer',
              instructions: 'You are a developer. You can read and write code.',
            },
            { name: 'QA', instructions: 'You are a QA engineer. You test the code.' },
          ];

          const added: string[] = [];
          for (const role of rolesToEnsure) {
            const roleRegex = new RegExp(`^##\\s+${role.name}\\b`, 'im');
            if (!content.match(roleRegex)) {
              content = content.trimEnd() + `\n\n## ${role.name}\n${role.instructions}\n`;
              added.push(role.name);
            }
          }

          fs.writeFileSync(agentsMdPath, content);
          if (added.length > 0) {
            console.log(`Added missing roles to AGENTS.md: ${added.join(', ')}`);
          } else {
            console.log('AGENTS.md updated with latest instructions.');
          }
        }
      });
  }

  private static copyRecursiveSync(src: string, dest: string) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyRecursiveSync(srcPath, destPath);
      } else {
        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
  }
}
