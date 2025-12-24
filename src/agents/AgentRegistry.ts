import fs from 'fs/promises';
import path from 'path';
import type { Agent } from '@/types/Agent';
import { validateAgent } from '@/agents/validateAgent';

export class AgentRegistry {
  private agents: Map<string, Agent> = new Map();
  private configPath: string;

  constructor(configPath: string = 'agents.json') {
    this.configPath = configPath;
  }

  async load(): Promise<void> {
    try {
      const content = await fs.readFile(this.configPath, 'utf-8');
      const data = JSON.parse(content) as { agents: Agent[] };
      this.agents.clear();
      for (const agent of data.agents) {
        validateAgent(agent);
        this.agents.set(agent.name, agent);
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
      this.agents.clear();
    }
  }

  async save(): Promise<void> {
    const agents = Array.from(this.agents.values());
    const data = { agents };
    const dir = path.dirname(this.configPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.configPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  addAgent(agent: Agent): void {
    validateAgent(agent);
    this.agents.set(agent.name, agent);
  }

  removeAgent(name: string): boolean {
    return this.agents.delete(name);
  }

  getAgent(name: string): Agent | undefined {
    return this.agents.get(name);
  }

  listAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  hasAgent(name: string): boolean {
    return this.agents.has(name);
  }

  static async findConfigFile(startDir: string = process.cwd()): Promise<string | undefined> {
    let currentDir = startDir;
    while (currentDir !== path.parse(currentDir).root) {
      const configPath = path.join(currentDir, 'agents.json');
      try {
        await fs.access(configPath);
        return configPath;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error;
        }
      }
      currentDir = path.dirname(currentDir);
    }
    return undefined;
  }
}
