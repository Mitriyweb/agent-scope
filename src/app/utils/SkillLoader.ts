import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { Skill, SkillMetadata } from '@/types/Skill';

export class SkillLoader {
  private skillsDir: string;

  constructor(baseDir: string = process.cwd()) {
    this.skillsDir = path.join(baseDir, '.agent-scope', 'skills');
  }

  listSkills(): Skill[] {
    if (!fs.existsSync(this.skillsDir)) {
      return [];
    }

    const files = fs.readdirSync(this.skillsDir).filter(file => file.endsWith('.md'));
    const skills: Skill[] = [];

    for (const file of files) {
      const filePath = path.join(this.skillsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { metadata } = this.parseSkillFile(content);

      skills.push({
        id: path.basename(file, '.md'),
        metadata,
        content: '', // Lazy loaded
        path: filePath,
      });
    }

    return skills;
  }

  loadSkillContent(skill: Skill): string {
    const content = fs.readFileSync(skill.path, 'utf-8');
    const { body } = this.parseSkillFile(content);
    return body;
  }

  private parseSkillFile(fileContent: string): { metadata: SkillMetadata; body: string } {
    const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (match) {
      try {
        const metadata = yaml.load(match[1]) as SkillMetadata;
        return { metadata, body: match[2].trim() };
      } catch (e) {
        console.error('Failed to parse YAML frontmatter:', e);
      }
    }
    // Fallback if no frontmatter
    return {
      metadata: { name: 'Unknown', description: 'No metadata found' },
      body: fileContent,
    };
  }
}
