import { SkillLoader } from '@/utils/SkillLoader';
import * as fs from 'fs';
import * as path from 'path';

describe('SkillLoader', () => {
  const testDir = path.join(__dirname, 'test-skills');
  const agentScopeDir = path.join(testDir, '.agent', 'skills');

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(agentScopeDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should list skills with metadata', () => {
    const content = `---
name: test-skill
description: A test skill
triggers:
  - test
---
# Test Content
This is the content.
`;
    fs.writeFileSync(path.join(agentScopeDir, 'test-skill.md'), content);

    const loader = new SkillLoader(testDir);
    const skills = loader.listSkills();

    expect(skills).toHaveLength(1);
    expect(skills[0].id).toBe('test-skill');
    expect(skills[0].metadata.name).toBe('test-skill');
    expect(skills[0].metadata.description).toBe('A test skill');
    expect(skills[0].metadata.triggers).toContain('test');
    expect(skills[0].content).toBe(''); // Content should be lazy loaded (empty initially)
  });

  it('should load skill content on demand', () => {
    const content = `---
name: test-skill
description: A test skill
---
# Test Content
This is the content.
`;
    fs.writeFileSync(path.join(agentScopeDir, 'test-skill.md'), content);

    const loader = new SkillLoader(testDir);
    const skills = loader.listSkills();
    const skill = skills[0];

    const body = loader.loadSkillContent(skill);
    expect(body).toContain('# Test Content');
    expect(body).toContain('This is the content.');
  });

  it('should handle missing frontmatter', () => {
    const content = '# Just Content';
    fs.writeFileSync(path.join(agentScopeDir, 'no-meta.md'), content);

    const loader = new SkillLoader(testDir);
    const skills = loader.listSkills();

    expect(skills).toHaveLength(1);
    expect(skills[0].metadata.name).toBe('Unknown');
  });

  it('should return empty list if skills directory does not exist', () => {
    fs.rmSync(testDir, { recursive: true, force: true });
    const loader = new SkillLoader(testDir);
    const skills = loader.listSkills();
    expect(skills).toEqual([]);
  });

  it('should handle invalid YAML in frontmatter', () => {
    const content = `---
invalid: yaml: : :
---
Body content`;
    fs.writeFileSync(path.join(agentScopeDir, 'invalid-yaml.md'), content);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const loader = new SkillLoader(testDir);
    const skills = loader.listSkills();

    expect(skills).toHaveLength(1);
    expect(skills[0].metadata.name).toBe('Unknown');
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
