import type { CommandHandler } from '@/types/index';
import { BuildConfigLoader, type BuildConfig } from '@/builders/BuildConfigLoader';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { createHash } from 'crypto';

export interface BuildArtifact {
  id: string;
  type: 'agent' | 'flow';
  name: string;
  content: unknown;
  timestamp: Date;
  checksum: string;
}

export class BuildCommand implements CommandHandler {
  private config: BuildConfig | null = null;
  private artifacts: BuildArtifact[] = [];

  execute(): void {
    try {
      this.config = BuildConfigLoader.load();
      this.compileAgents();
      this.compileFlows();
      this.generateMetadata();
      this.outputArtifacts();
      console.log('✓ Build completed successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`✗ Build failed: ${message}`);
      throw error;
    }
  }

  private compileAgents(): void {
    if (!this.config?.agents || this.config.agents.length === 0) {
      return;
    }

    for (const agentName of this.config.agents) {
      try {
        const agentPath = resolve(process.cwd(), 'src', 'agents', `${agentName}.ts`);
        const agentContent = readFileSync(agentPath, 'utf-8');

        const artifact: BuildArtifact = {
          id: `${this.config.name}-agent-${agentName}`,
          type: 'agent',
          name: agentName,
          content: { source: agentContent },
          timestamp: new Date(),
          checksum: this.calculateChecksum(agentContent),
        };

        this.artifacts.push(artifact);
        console.log(`  ✓ Compiled agent: ${agentName}`);
      } catch (error) {
        throw new Error(`Failed to compile agent "${agentName}": ${String(error)}`);
      }
    }
  }

  private compileFlows(): void {
    if (!this.config?.flows || this.config.flows.length === 0) {
      return;
    }

    for (const flowName of this.config.flows) {
      try {
        const flowPath = resolve(process.cwd(), 'src', 'flows', `${flowName}.ts`);
        const flowContent = readFileSync(flowPath, 'utf-8');

        const artifact: BuildArtifact = {
          id: `${this.config.name}-flow-${flowName}`,
          type: 'flow',
          name: flowName,
          content: { source: flowContent },
          timestamp: new Date(),
          checksum: this.calculateChecksum(flowContent),
        };

        this.artifacts.push(artifact);
        console.log(`  ✓ Compiled flow: ${flowName}`);
      } catch (error) {
        throw new Error(`Failed to compile flow "${flowName}": ${String(error)}`);
      }
    }
  }

  private generateMetadata(): void {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }

    const metadata = {
      name: this.config.name,
      version: this.config.version,
      timestamp: new Date().toISOString(),
      artifacts: this.artifacts.map(a => ({
        id: a.id,
        type: a.type,
        name: a.name,
        checksum: a.checksum,
      })),
    };

    const outputDir = this.config.outputDir ?? 'dist';
    mkdirSync(outputDir, { recursive: true });

    const metadataPath = join(outputDir, 'metadata.json');
    writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  }

  private outputArtifacts(): void {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }

    const outputDir = this.config.outputDir ?? 'dist';
    const format = this.config.outputFormat ?? 'json';

    if (format === 'json') {
      this.outputAsJson(outputDir);
    } else if (format === 'archive') {
      this.outputAsArchive(outputDir);
    }
  }

  private outputAsJson(outputDir: string): void {
    mkdirSync(join(outputDir, 'agents'), { recursive: true });
    mkdirSync(join(outputDir, 'flows'), { recursive: true });

    for (const artifact of this.artifacts) {
      const subdir = artifact.type === 'agent' ? 'agents' : 'flows';
      const filePath = join(outputDir, subdir, `${artifact.name}.json`);
      writeFileSync(filePath, JSON.stringify(artifact, null, 2));
    }
  }

  private outputAsArchive(_outputDir: string): void {
    console.log(`  ℹ Archive format requires tar/gzip support (future implementation)`);
  }

  private calculateChecksum(content: string): string {
    return createHash('sha256').update(content).digest('hex').substring(0, 16);
  }
}
