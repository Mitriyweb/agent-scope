import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

export class SkillCommand {
  static register(program: Command) {
    const skillCmd = program.command('skill').description('Manage skills');

    skillCmd
      .command('add <name>')
      .description('Create a new skill')
      .action(name => {
        const skillsDir = path.join(process.cwd(), '.agent-scope', 'skills');
        if (!fs.existsSync(skillsDir)) {
          fs.mkdirSync(skillsDir, { recursive: true });
        }

        const filePath = path.join(skillsDir, `${name}.md`);
        if (fs.existsSync(filePath)) {
          console.error(`Skill ${name} already exists.`);
          process.exit(1);
        }

        const template = `---
name: ${name}
description: Description for ${name}
triggers:
  - keyword
---
# ${name} Instructions

Write your skill instructions here.
`;
        fs.writeFileSync(filePath, template);
        console.log(`Skill created at ${filePath}`);
      });
  }
}
