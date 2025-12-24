import { execSync } from 'child_process';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('CLI E2E Tests', (): void => {
  let testDir: string;

  beforeEach((): void => {
    testDir = join(tmpdir(), `agent-scope-e2e-${Date.now()}`);
    execSync(`mkdir -p ${testDir}`);
  });

  afterEach((): void => {
    try {
      execSync(`rm -rf ${testDir}`);
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('init command', (): void => {
    it('should initialize agents.json', (): void => {
      const output = execSync(`cd ${testDir} && node ${process.cwd()}/bin/agent-scope init`, {
        encoding: 'utf-8',
      });

      expect(output).toContain('✓ Initialized agents.json');
      expect(existsSync(join(testDir, 'agents.json'))).toBe(true);
    });

    it('should create valid agents.json structure', (): void => {
      execSync(`cd ${testDir} && node ${process.cwd()}/bin/agent-scope init`, {
        encoding: 'utf-8',
      });

      const agentsFile = readFileSync(join(testDir, 'agents.json'), 'utf-8');
      const agents = JSON.parse(agentsFile);

      expect(agents).toHaveProperty('agents');
      expect(Array.isArray(agents.agents)).toBe(true);
    });
  });

  describe('build command', (): void => {
    it('should fail without build configuration', (): void => {
      expect((): void => {
        execSync(`cd ${testDir} && node ${process.cwd()}/bin/agent-scope build`, {
          encoding: 'utf-8',
        });
      }).toThrow();
    });

    it('should build with valid configuration', (): void => {
      const buildConfig = {
        name: 'test-project',
        version: '1.0.0',
        agents: [],
        flows: [],
        outputDir: 'dist-build',
      };

      writeFileSync(join(testDir, 'agent-scope.build.json'), JSON.stringify(buildConfig, null, 2));

      const output = execSync(`cd ${testDir} && node ${process.cwd()}/bin/agent-scope build`, {
        encoding: 'utf-8',
      });

      expect(output).toContain('✓ Build completed successfully');
      expect(existsSync(join(testDir, 'dist-build'))).toBe(true);
      expect(existsSync(join(testDir, 'dist-build', 'metadata.json'))).toBe(true);
    });

    it('should generate valid metadata', (): void => {
      const buildConfig = {
        name: 'test-project',
        version: '1.0.0',
        agents: [],
        flows: [],
        outputDir: 'dist-build',
      };

      writeFileSync(join(testDir, 'agent-scope.build.json'), JSON.stringify(buildConfig, null, 2));

      execSync(`cd ${testDir} && node ${process.cwd()}/bin/agent-scope build`, {
        encoding: 'utf-8',
      });

      const metadata = JSON.parse(
        readFileSync(join(testDir, 'dist-build', 'metadata.json'), 'utf-8')
      );

      expect(metadata).toHaveProperty('name', 'test-project');
      expect(metadata).toHaveProperty('version', '1.0.0');
      expect(metadata).toHaveProperty('timestamp');
      expect(metadata).toHaveProperty('artifacts');
      expect(Array.isArray(metadata.artifacts)).toBe(true);
    });
  });

  describe('execute command', (): void => {
    it('should fail without agents.json', (): void => {
      expect((): void => {
        execSync(
          `cd ${testDir} && node ${process.cwd()}/bin/agent-scope execute --agent developer --command "echo test"`,
          { encoding: 'utf-8' }
        );
      }).toThrow();
    });

    it('should fail with non-existent agent', (): void => {
      execSync(`cd ${testDir} && node ${process.cwd()}/bin/agent-scope init`, {
        encoding: 'utf-8',
      });

      expect((): void => {
        execSync(
          `cd ${testDir} && node ${process.cwd()}/bin/agent-scope execute --agent developer --command "echo test"`,
          { encoding: 'utf-8' }
        );
      }).toThrow();
    });

    it('should provide helpful error message for missing agent', (): void => {
      execSync(`cd ${testDir} && node ${process.cwd()}/bin/agent-scope init`, {
        encoding: 'utf-8',
      });

      try {
        execSync(
          `cd ${testDir} && node ${process.cwd()}/bin/agent-scope execute --agent developer --command "echo test"`,
          { encoding: 'utf-8' }
        );
      } catch (error) {
        const stderr = (error as { stderr?: Buffer }).stderr?.toString() || '';
        expect(stderr).toContain('agent add');
      }
    });
  });

  describe('help command', (): void => {
    it('should display help message', (): void => {
      const output = execSync(`node ${process.cwd()}/bin/agent-scope help`, {
        encoding: 'utf-8',
      });

      expect(output).toContain('agent-scope');
      expect(output).toContain('Commands:');
      expect(output).toContain('build');
      expect(output).toContain('execute');
      expect(output).toContain('init');
    });

    it('should display help with --help flag', (): void => {
      const output = execSync(`node ${process.cwd()}/bin/agent-scope --help`, {
        encoding: 'utf-8',
      });

      expect(output).toContain('agent-scope');
      expect(output).toContain('Commands:');
    });
  });

  describe('version command', (): void => {
    it('should display version', (): void => {
      const output = execSync(`node ${process.cwd()}/bin/agent-scope version`, {
        encoding: 'utf-8',
      });

      expect(output).toMatch(/agent-scope v\d+\.\d+\.\d+/);
    });

    it('should display version with --version flag', (): void => {
      const output = execSync(`node ${process.cwd()}/bin/agent-scope --version`, {
        encoding: 'utf-8',
      });

      expect(output).toMatch(/agent-scope v\d+\.\d+\.\d+/);
    });
  });

  describe('workflow integration', (): void => {
    it('should complete init -> build workflow', (): void => {
      // Initialize
      execSync(`cd ${testDir} && node ${process.cwd()}/bin/agent-scope init`, {
        encoding: 'utf-8',
      });

      // Create build config
      const buildConfig = {
        name: 'workflow-test',
        version: '1.0.0',
        agents: [],
        flows: [],
        outputDir: 'dist',
      };

      writeFileSync(join(testDir, 'agent-scope.build.json'), JSON.stringify(buildConfig, null, 2));

      // Build
      const buildOutput = execSync(`cd ${testDir} && node ${process.cwd()}/bin/agent-scope build`, {
        encoding: 'utf-8',
      });

      expect(buildOutput).toContain('✓ Build completed successfully');
      expect(existsSync(join(testDir, 'dist', 'metadata.json'))).toBe(true);
    });
  });
});
