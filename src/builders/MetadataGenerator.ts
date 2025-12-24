import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface ArtifactMetadata {
  id: string;
  type: 'agent' | 'flow';
  name: string;
  checksum: string;
}

export interface BuildMetadata {
  name: string;
  version: string;
  timestamp: string;
  artifacts: ArtifactMetadata[];
}

export class MetadataGenerator {
  static generate(
    name: string,
    version: string,
    artifacts: ArtifactMetadata[],
    outputDir: string
  ): void {
    mkdirSync(outputDir, { recursive: true });

    const metadata: BuildMetadata = {
      name,
      version,
      timestamp: new Date().toISOString(),
      artifacts,
    };

    const metadataPath = join(outputDir, 'metadata.json');
    writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  }

  static read(outputDir: string): BuildMetadata | null {
    try {
      const fs = require('fs');
      const metadataPath = join(outputDir, 'metadata.json');

      if (!fs.existsSync(metadataPath)) {
        return null;
      }

      const content = fs.readFileSync(metadataPath, 'utf-8');
      return JSON.parse(content) as BuildMetadata;
    } catch {
      return null;
    }
  }
}
