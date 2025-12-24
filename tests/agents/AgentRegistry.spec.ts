import { AgentRegistry } from '@/agents/AgentRegistry';
import { Role } from '@/enums/Role';
import type { Agent } from '@/types/Agent';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

describe('AgentRegistry', () => {
  let tempDir: string;
  let configPath: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-scope-test-'));
    configPath = path.join(tempDir, 'agents.json');
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  const createTestAgent = (name: string, role: Role = Role.DEVELOPER): Agent => ({
    name,
    role,
    scope: {
      patterns: ['src/**'],
      readOnly: false,
    },
  });

  it('should add agent', () => {
    const registry = new AgentRegistry(configPath);
    const agent = createTestAgent('test-agent');

    registry.addAgent(agent);
    expect(registry.getAgent('test-agent')).toEqual(agent);
  });

  it('should remove agent', () => {
    const registry = new AgentRegistry(configPath);
    const agent = createTestAgent('test-agent');

    registry.addAgent(agent);
    expect(registry.removeAgent('test-agent')).toBe(true);
    expect(registry.getAgent('test-agent')).toBeUndefined();
  });

  it('should return false when removing non-existent agent', () => {
    const registry = new AgentRegistry(configPath);
    expect(registry.removeAgent('non-existent')).toBe(false);
  });

  it('should list all agents', () => {
    const registry = new AgentRegistry(configPath);
    const agent1 = createTestAgent('agent1');
    const agent2 = createTestAgent('agent2', Role.QA);

    registry.addAgent(agent1);
    registry.addAgent(agent2);

    const agents = registry.listAgents();
    expect(agents).toHaveLength(2);
    expect(agents).toContainEqual(agent1);
    expect(agents).toContainEqual(agent2);
  });

  it('should check if agent exists', () => {
    const registry = new AgentRegistry(configPath);
    const agent = createTestAgent('test-agent');

    registry.addAgent(agent);
    expect(registry.hasAgent('test-agent')).toBe(true);
    expect(registry.hasAgent('non-existent')).toBe(false);
  });

  it('should save and load agents', async () => {
    const registry1 = new AgentRegistry(configPath);
    const agent = createTestAgent('test-agent');

    registry1.addAgent(agent);
    await registry1.save();

    const registry2 = new AgentRegistry(configPath);
    await registry2.load();

    expect(registry2.getAgent('test-agent')).toEqual(agent);
  });

  it('should handle missing config file on load', async () => {
    const registry = new AgentRegistry(configPath);
    await registry.load();

    expect(registry.listAgents()).toHaveLength(0);
  });

  it('should reject invalid agent', () => {
    const registry = new AgentRegistry(configPath);
    const invalidAgent = {
      name: '',
      role: Role.DEVELOPER,
      scope: { patterns: ['src/**'], readOnly: false },
    };

    expect(() => registry.addAgent(invalidAgent as Agent)).toThrow();
  });
});
