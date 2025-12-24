import { BuildConfigLoader } from '@/builders/BuildConfigLoader';
import { writeFileSync, rmSync } from 'fs';
import { join } from 'path';

describe('BuildConfigLoader', () => {
  const testConfigPath = join(process.cwd(), 'test-build.json');

  afterEach(() => {
    if (require('fs').existsSync(testConfigPath)) {
      rmSync(testConfigPath);
    }
  });

  it('should load valid build configuration', () => {
    const config = {
      name: 'test-app',
      version: '1.0.0',
      agents: ['agent1'],
      flows: ['flow1'],
    };

    writeFileSync(testConfigPath, JSON.stringify(config));

    const loaded = BuildConfigLoader.load(testConfigPath);
    expect(loaded.name).toBe('test-app');
    expect(loaded.version).toBe('1.0.0');
    expect(loaded.agents).toEqual(['agent1']);
    expect(loaded.flows).toEqual(['flow1']);
  });

  it('should load configuration with optional fields', () => {
    const config = {
      name: 'test-app',
      version: '1.0.0',
      outputFormat: 'json' as const,
      outputDir: 'dist',
    };

    writeFileSync(testConfigPath, JSON.stringify(config));

    const loaded = BuildConfigLoader.load(testConfigPath);
    expect(loaded.outputFormat).toBe('json');
    expect(loaded.outputDir).toBe('dist');
  });

  it('should throw error when name is missing', () => {
    const config = {
      version: '1.0.0',
    };

    writeFileSync(testConfigPath, JSON.stringify(config));

    expect(() => {
      BuildConfigLoader.load(testConfigPath);
    }).toThrow('name');
  });

  it('should throw error when version is missing', () => {
    const config = {
      name: 'test-app',
    };

    writeFileSync(testConfigPath, JSON.stringify(config));

    expect(() => {
      BuildConfigLoader.load(testConfigPath);
    }).toThrow('version');
  });

  it('should throw error when file does not exist', () => {
    expect(() => {
      BuildConfigLoader.load('/nonexistent/path/config.json');
    }).toThrow('not found');
  });

  it('should validate agents field is array', () => {
    const config = {
      name: 'test-app',
      version: '1.0.0',
      agents: 'not-an-array',
    };

    writeFileSync(testConfigPath, JSON.stringify(config));

    expect(() => {
      BuildConfigLoader.load(testConfigPath);
    }).toThrow('array');
  });

  it('should validate flows field is array', () => {
    const config = {
      name: 'test-app',
      version: '1.0.0',
      flows: 123,
    };

    writeFileSync(testConfigPath, JSON.stringify(config));

    expect(() => {
      BuildConfigLoader.load(testConfigPath);
    }).toThrow('array');
  });

  it('should validate outputFormat is valid', () => {
    const config = {
      name: 'test-app',
      version: '1.0.0',
      outputFormat: 'invalid',
    };

    writeFileSync(testConfigPath, JSON.stringify(config));

    expect(() => {
      BuildConfigLoader.load(testConfigPath);
    }).toThrow('outputFormat');
  });

  it('should throw error for invalid JSON', () => {
    writeFileSync(testConfigPath, 'invalid json {');

    expect(() => {
      BuildConfigLoader.load(testConfigPath);
    }).toThrow();
  });

  it('should throw error when config is not an object', () => {
    writeFileSync(testConfigPath, '"string"');

    expect(() => {
      BuildConfigLoader.load(testConfigPath);
    }).toThrow('object');
  });

  it('should use default path when not provided', () => {
    const config = {
      name: 'test-app',
      version: '1.0.0',
    };

    const defaultPath = join(process.cwd(), 'agent-scope.build.json');
    writeFileSync(defaultPath, JSON.stringify(config));

    const loaded = BuildConfigLoader.load();
    expect(loaded.name).toBe('test-app');

    rmSync(defaultPath);
  });
});
