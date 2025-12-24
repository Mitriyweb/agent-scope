import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import type { Agent } from '@/types/Agent';

export interface IsolatedContext {
  cwd: string;
  env: NodeJS.ProcessEnv;
  tempDir: string;
}

export class ContextIsolation {
  private tempDirs: Map<string, string> = new Map();

  async createIsolatedContext(
    agent: Agent,
    baseDir: string = process.cwd()
  ): Promise<IsolatedContext> {
    // Create isolated temp directory
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `agent-${agent.name}-`));
    this.tempDirs.set(agent.name, tempDir);

    // Create isolated environment
    const env = {
      ...process.env,
      AGENT_NAME: agent.name,
      AGENT_SCOPE_TEMP: tempDir,
      AGENT_SCOPE_BASE: baseDir,
    };

    // Set working directory to base
    const cwd = baseDir;

    return {
      cwd,
      env,
      tempDir,
    };
  }

  isReadOnly(agent: Agent): boolean {
    return agent.scope.readOnly;
  }

  async cleanup(agentName: string): Promise<void> {
    const tempDir = this.tempDirs.get(agentName);
    if (tempDir) {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
        this.tempDirs.delete(agentName);
      } catch (error) {
        console.error(`Failed to cleanup temp directory for ${agentName}:`, error);
      }
    }
  }

  async cleanupAll(): Promise<void> {
    for (const agentName of this.tempDirs.keys()) {
      await this.cleanup(agentName);
    }
  }
}
