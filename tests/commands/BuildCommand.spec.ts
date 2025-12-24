import { BuildCommand } from '@/commands/BuildCommand';
import { writeFileSync, mkdirSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';

describe('BuildCommand', () => {
  const testDir = join(process.cwd(), 'test-build-output');
  const configPath = join(process.cwd(), 'agent-scope.build.json');

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (require('fs').existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    if (require('fs').existsSync(configPath)) {
      rmSync(configPath);
    }
  });

  it('should create a BuildCommand instance', () => {
    const command = new BuildCommand();
    expect(command).toBeInstanceOf(BuildCommand);
  });

  it('should throw error when configuration file is missing', () => {
    const command = new BuildCommand();
    expect(() => {
      command.execute();
    }).toThrow();
  });

  it('should load valid build configuration', () => {
    const config = {
      name: 'test-project',
      version: '1.0.0',
      agents: [],
      flows: [],
      outputDir: testDir,
    };

    writeFileSync(configPath, JSON.stringify(config));

    const command = new BuildCommand();
    expect(() => {
      command.execute();
    }).not.toThrow();
  });

  it('should validate required configuration fields', () => {
    const invalidConfig = {
      version: '1.0.0',
    };

    writeFileSync(configPath, JSON.stringify(invalidConfig));

    const command = new BuildCommand();
    expect(() => {
      command.execute();
    }).toThrow();
  });

  it('should generate metadata file', () => {
    const config = {
      name: 'test-project',
      version: '1.0.0',
      agents: [],
      flows: [],
      outputDir: testDir,
    };

    writeFileSync(configPath, JSON.stringify(config));

    const command = new BuildCommand();
    command.execute();

    const metadataPath = join(testDir, 'metadata.json');
    expect(require('fs').existsSync(metadataPath)).toBe(true);

    const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
    expect(metadata.name).toBe('test-project');
    expect(metadata.version).toBe('1.0.0');
    expect(metadata.artifacts).toBeDefined();
  });

  it('should handle configuration with outputFormat', () => {
    const config = {
      name: 'test-project',
      version: '1.0.0',
      agents: [],
      flows: [],
      outputFormat: 'json' as const,
      outputDir: testDir,
    };

    writeFileSync(configPath, JSON.stringify(config));

    const command = new BuildCommand();
    expect(() => {
      command.execute();
    }).not.toThrow();
  });

  it('should create output directories', () => {
    const config = {
      name: 'test-project',
      version: '1.0.0',
      agents: [],
      flows: [],
      outputDir: testDir,
    };

    writeFileSync(configPath, JSON.stringify(config));

    const command = new BuildCommand();
    command.execute();

    expect(require('fs').existsSync(join(testDir, 'agents'))).toBe(true);
    expect(require('fs').existsSync(join(testDir, 'flows'))).toBe(true);
  });
});
