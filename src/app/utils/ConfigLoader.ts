import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { AgentConfig } from '@/types/AgentConfig';
import { Role } from '@/enums/Role';

export class ConfigLoader {
  private configPath: string;

  constructor(baseDir: string = process.cwd()) {
    this.configPath = path.join(baseDir, '.agent-scope', 'agents.yaml');
  }

  loadAgents(): AgentConfig[] {
    if (!fs.existsSync(this.configPath)) {
      return [];
    }
    const content = fs.readFileSync(this.configPath, 'utf-8');
    try {
      const data = yaml.load(content) as { agents?: Record<string, unknown>[] };
      if (!data || !Array.isArray(data.agents)) {
        return [];
      }
      return data.agents.map(agent => ({
        name: String(agent.name),
        role: this.parseRole(String(agent.role)),
        description: String(agent.description || ''),
        scope: Array.isArray(agent.scope) ? agent.scope.map(String) : [],
        model: agent.model ? String(agent.model) : undefined,
      }));
    } catch (e) {
      console.error('Failed to parse agents.yaml:', e);
      return [];
    }
  }

  saveAgents(agents: AgentConfig[]): void {
    const dir = path.dirname(this.configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const data = { agents };
    fs.writeFileSync(this.configPath, yaml.dump(data));
  }

  private parseRole(roleStr: string): Role {
    const role = Object.values(Role).find(r => r === roleStr);
    return role ?? Role.Unknown;
  }

  loadAgentsMd(): Record<string, string> {
    const agentsMdPath = path.join(path.dirname(this.configPath), 'AGENTS.md');
    if (!fs.existsSync(agentsMdPath)) {
      return {};
    }
    const content = fs.readFileSync(agentsMdPath, 'utf-8');
    const sections: Record<string, string> = {};
    const lines = content.split('\n');
    let currentRole: string | null = null;
    let currentBuffer: string[] = [];

    for (const line of lines) {
      const match = line.match(/^##\s+(.+)$/);
      if (match) {
        if (currentRole) {
          sections[currentRole] = currentBuffer.join('\n').trim();
        }
        currentRole = match[1].trim().toLowerCase(); // Normalize key
        currentBuffer = [];
      } else if (currentRole) {
        currentBuffer.push(line);
      }
    }
    if (currentRole) {
      sections[currentRole] = currentBuffer.join('\n').trim();
    }
    return sections;
  }
}
