import { ConfigLoader } from '@/utils/ConfigLoader';
import { Role } from '@/enums/Role';
import * as fs from 'fs';
import * as path from 'path';

describe('ConfigLoader', () => {
  const testDir = path.join(__dirname, 'test-config');
  const agentScopeDir = path.join(testDir, '.agent-scope');
  const agentsYamlPath = path.join(agentScopeDir, 'agents.yaml');
  const agentsMdPath = path.join(agentScopeDir, 'AGENTS.md');

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

  it('should save and load agents', () => {
    const loader = new ConfigLoader(testDir);
    const agents = [
      {
        name: 'test-agent',
        role: Role.Developer,
        description: 'test description',
        scope: ['src'],
      },
    ];

    loader.saveAgents(agents);
    expect(fs.existsSync(agentsYamlPath)).toBe(true);

    const loaded = loader.loadAgents();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe('test-agent');
    expect(loaded[0].role).toBe(Role.Developer);
  });

  it('should return empty list if config does not exist', () => {
    const loader = new ConfigLoader(testDir);
    const loaded = loader.loadAgents();
    expect(loaded).toEqual([]);
  });

  it('should parse AGENTS.md', () => {
    const content = `
# Project Instructions

## Developer
You are a developer.

## QA
You are a QA.
`;
    fs.writeFileSync(agentsMdPath, content);

    const loader = new ConfigLoader(testDir);
    const instructions = loader.loadAgentsMd();

    expect(instructions['developer']).toContain('You are a developer.');
    expect(instructions['qa']).toContain('You are a QA.');
  });

  it('should return empty object if AGENTS.md does not exist', () => {
    const loader = new ConfigLoader(testDir);
    const instructions = loader.loadAgentsMd();
    expect(instructions).toEqual({});
  });

  it('should return empty list if agents.yaml is invalid', () => {
    fs.writeFileSync(agentsYamlPath, 'invalid: : yaml');
    const loader = new ConfigLoader(testDir);
    const loaded = loader.loadAgents();
    expect(loaded).toEqual([]);
  });
});
