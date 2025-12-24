import { ArtifactValidator } from '@/builders/ArtifactValidator';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

describe('ArtifactValidator', () => {
  const testDir = join(process.cwd(), 'test-artifacts');

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (require('fs').existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should validate a valid artifact', () => {
    const artifactPath = join(testDir, 'agent.json');
    const artifact = {
      id: 'test-agent-1',
      type: 'agent',
      name: 'TestAgent',
      checksum: 'abc123',
      content: { source: 'test' },
    };

    writeFileSync(artifactPath, JSON.stringify(artifact));

    const result = ArtifactValidator.validateArtifact(artifactPath);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.id).toBe('test-agent-1');
    expect(result.type).toBe('agent');
  });

  it('should detect missing id field', () => {
    const artifactPath = join(testDir, 'agent.json');
    const artifact = {
      type: 'agent',
      name: 'TestAgent',
      checksum: 'abc123',
    };

    writeFileSync(artifactPath, JSON.stringify(artifact));

    const result = ArtifactValidator.validateArtifact(artifactPath);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should detect invalid type field', () => {
    const artifactPath = join(testDir, 'agent.json');
    const artifact = {
      id: 'test-1',
      type: 'invalid',
      name: 'TestAgent',
      checksum: 'abc123',
    };

    writeFileSync(artifactPath, JSON.stringify(artifact));

    const result = ArtifactValidator.validateArtifact(artifactPath);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('type'))).toBe(true);
  });

  it('should handle invalid JSON', () => {
    const artifactPath = join(testDir, 'agent.json');
    writeFileSync(artifactPath, 'invalid json {');

    const result = ArtifactValidator.validateArtifact(artifactPath);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should validate directory with multiple artifacts', () => {
    mkdirSync(join(testDir, 'agents'), { recursive: true });
    mkdirSync(join(testDir, 'flows'), { recursive: true });

    const agent = {
      id: 'agent-1',
      type: 'agent',
      name: 'Agent1',
      checksum: 'abc123',
    };

    const flow = {
      id: 'flow-1',
      type: 'flow',
      name: 'Flow1',
      checksum: 'def456',
    };

    writeFileSync(join(testDir, 'agents', 'agent1.json'), JSON.stringify(agent));
    writeFileSync(join(testDir, 'flows', 'flow1.json'), JSON.stringify(flow));

    const results = ArtifactValidator.validateDirectory(testDir);
    expect(results.length).toBe(2);
  });
});
