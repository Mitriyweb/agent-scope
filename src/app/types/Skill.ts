export interface SkillMetadata {
  name: string;
  description: string;
  triggers?: string[];
  [key: string]: unknown;
}

export interface Skill {
  id: string;
  metadata: SkillMetadata;
  content: string; // Markdown content
  path: string; // File path
}
