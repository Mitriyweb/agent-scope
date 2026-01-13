import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { EnvironmentSetup, EnvironmentPrompts } from '../environment/index';

export class InitCommand {
  static register(program: Command) {
    program
      .command('init')
      .description('Initialize agent-scope project')
      .option('--skip-env', 'Skip development environment setup')
      .action(async options => {
        const baseDir = process.cwd();

        // Development Environment Setup - FIRST QUESTION
        if (!options.skipEnv) {
          try {
            await this.setupDevelopmentEnvironment(baseDir);
          } catch (error) {
            console.error('Environment setup failed:', error);
            console.log('Continuing with basic project initialization...');
          }
        } else {
          console.log('Skipped development environment setup (use --skip-env flag)');
          // Create .agent if --skip-env is used
          this.createAgentDirectory(baseDir);
        }

        console.log('\n✅ Project initialization complete!');
      });
  }

  private static createAgentDirectory(baseDir: string): void {
    const agentScopeDir = path.join(baseDir, '.agent');
    const agentsMdPath = path.join(agentScopeDir, 'AGENTS.md');
    const rootAgentsMdPath = path.join(baseDir, 'AGENTS.md');

    if (!fs.existsSync(agentScopeDir)) {
      fs.mkdirSync(agentScopeDir, { recursive: true });
      console.log('Created .agent/ directory');
    } else {
      console.log('.agent/ directory already exists');
    }

    // Migrate existing root AGENTS.md if .agent/AGENTS.md doesn't exist
    if (fs.existsSync(rootAgentsMdPath) && !fs.existsSync(agentsMdPath)) {
      fs.copyFileSync(rootAgentsMdPath, agentsMdPath);
      console.log('Migrated root AGENTS.md to .agent/AGENTS.md');
    }

    // Migrate existing ai/ directory if it exists
    const oldAiDir = path.join(baseDir, 'ai');
    if (fs.existsSync(oldAiDir)) {
      console.log('Migrating existing ai/ directory rules to .agent/');
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
You are a QA engineer. You test the code.
`;
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
        // Escape special regex characters properly
        const escapedStart = currentStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedEnd = currentEnd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`${escapedStart}[\\s\\S]*?${escapedEnd}`, 'g');
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

  private static async setupDevelopmentEnvironment(projectPath: string): Promise<void> {
    const options = EnvironmentSetup.getAvailableOptions();

    const existing = EnvironmentSetup.detectExisting(projectPath);

    const selection = await EnvironmentPrompts.promptForEnvironmentSelection(
      options.ides,
      options.aiTools,
      existing.aiTools
    );

    if (selection) {
      const hasWindsurf = selection.aiTools.includes('windsurf');
      const hasUniversal = selection.aiTools.includes('universal-agents');

      // Create .agent before setupEnvironment if Windsurf is selected
      // (Windsurf needs .agent to copy from)
      if (hasWindsurf) {
        this.createAgentDirectory(projectPath);
      }

      const result = await EnvironmentSetup.setupEnvironment(projectPath, selection);
      EnvironmentPrompts.showResults(result);

      // Create .agent after setupEnvironment if Universal is selected
      if (hasUniversal) {
        this.createAgentDirectory(projectPath);
      }

      // Delete .agent if only Windsurf was selected (not Universal)
      // Windsurf has already copied it to .windsurf
      if (hasWindsurf && !hasUniversal) {
        const agentDir = path.join(projectPath, '.agent');
        if (fs.existsSync(agentDir)) {
          fs.rmSync(agentDir, { recursive: true, force: true });
          console.log('Removed .agent/ directory (Windsurf copied content to .windsurf/)');
        }
      }
    }
  }
}
