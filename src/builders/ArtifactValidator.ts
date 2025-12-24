import { readFileSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

export interface ValidatedArtifact {
  id: string;
  type: 'agent' | 'flow';
  name: string;
  valid: boolean;
  errors: string[];
  checksum: string;
}

export class ArtifactValidator {
  static validateArtifact(artifactPath: string): ValidatedArtifact {
    try {
      const content = readFileSync(artifactPath, 'utf-8');
      const artifact = JSON.parse(content) as Record<string, unknown>;

      const errors: string[] = [];

      if (!artifact.id || typeof artifact.id !== 'string') {
        errors.push('Missing or invalid "id" field');
      }

      if (!artifact.type || !['agent', 'flow'].includes(artifact.type as string)) {
        errors.push('Missing or invalid "type" field (must be "agent" or "flow")');
      }

      if (!artifact.name || typeof artifact.name !== 'string') {
        errors.push('Missing or invalid "name" field');
      }

      if (!artifact.checksum || typeof artifact.checksum !== 'string') {
        errors.push('Missing or invalid "checksum" field');
      }

      const checksum = this.calculateChecksum(content);

      return {
        id: (artifact.id as string) ?? 'unknown',
        type: (artifact.type as 'agent' | 'flow') ?? 'agent',
        name: (artifact.name as string) ?? 'unknown',
        valid: errors.length === 0,
        errors,
        checksum,
      };
    } catch (error) {
      return {
        id: 'unknown',
        type: 'agent',
        name: 'unknown',
        valid: false,
        errors: [`Failed to parse artifact: ${String(error)}`],
        checksum: '',
      };
    }
  }

  static validateDirectory(distDir: string): ValidatedArtifact[] {
    const results: ValidatedArtifact[] = [];

    try {
      const fs = require('fs');
      const agentsDir = join(distDir, 'agents');
      const flowsDir = join(distDir, 'flows');

      if (fs.existsSync(agentsDir)) {
        const files = fs.readdirSync(agentsDir);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const result = this.validateArtifact(join(agentsDir, file));
            results.push(result);
          }
        }
      }

      if (fs.existsSync(flowsDir)) {
        const files = fs.readdirSync(flowsDir);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const result = this.validateArtifact(join(flowsDir, file));
            results.push(result);
          }
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }

    return results;
  }

  private static calculateChecksum(content: string): string {
    return createHash('sha256').update(content).digest('hex').substring(0, 16);
  }
}
