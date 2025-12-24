import { readFileSync } from 'fs';
import { resolve } from 'path';

export interface BuildConfig {
  name: string;
  version: string;
  agents?: string[];
  flows?: string[];
  outputFormat?: 'json' | 'archive';
  outputDir?: string;
}

export class BuildConfigLoader {
  static load(configPath?: string): BuildConfig {
    const path = configPath ?? resolve(process.cwd(), 'agent-scope.build.json');

    try {
      const content = readFileSync(path, 'utf-8');
      const config = JSON.parse(content) as BuildConfig;
      this.validate(config);
      return config;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(
          `Build configuration not found at ${path}. Create agent-scope.build.json in your project root.`
        );
      }
      throw new Error(`Failed to load build configuration: ${String(error)}`);
    }
  }

  private static validate(config: unknown): asserts config is BuildConfig {
    if (!config || typeof config !== 'object') {
      throw new Error('Configuration must be a valid JSON object');
    }

    const cfg = config as Record<string, unknown>;

    if (!cfg.name || typeof cfg.name !== 'string') {
      throw new Error('Configuration must include a "name" field (string)');
    }

    if (!cfg.version || typeof cfg.version !== 'string') {
      throw new Error('Configuration must include a "version" field (string)');
    }

    if (cfg.agents && !Array.isArray(cfg.agents)) {
      throw new Error('Configuration "agents" field must be an array');
    }

    if (cfg.flows && !Array.isArray(cfg.flows)) {
      throw new Error('Configuration "flows" field must be an array');
    }

    if (cfg.outputFormat && !['json', 'archive'].includes(cfg.outputFormat as string)) {
      throw new Error('Configuration "outputFormat" must be "json" or "archive"');
    }
  }
}
