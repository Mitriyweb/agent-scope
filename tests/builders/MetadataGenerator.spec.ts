import { MetadataGenerator } from '@/builders/MetadataGenerator';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';

describe('MetadataGenerator', () => {
  const testDir = join(process.cwd(), 'test-metadata');

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should generate metadata file', () => {
    const artifacts = [
      { id: 'agent-1', type: 'agent' as const, name: 'Agent1', checksum: 'abc123' },
      { id: 'flow-1', type: 'flow' as const, name: 'Flow1', checksum: 'def456' },
    ];

    MetadataGenerator.generate('test-app', '1.0.0', artifacts, testDir);

    const metadataPath = join(testDir, 'metadata.json');
    expect(existsSync(metadataPath)).toBe(true);
  });

  it('should include correct metadata content', () => {
    const artifacts = [
      { id: 'agent-1', type: 'agent' as const, name: 'Agent1', checksum: 'abc123' },
    ];

    MetadataGenerator.generate('test-app', '1.0.0', artifacts, testDir);

    const metadata = MetadataGenerator.read(testDir);
    expect(metadata).not.toBeNull();
    expect(metadata?.name).toBe('test-app');
    expect(metadata?.version).toBe('1.0.0');
    expect(metadata?.artifacts).toHaveLength(1);
    expect(metadata?.artifacts[0].id).toBe('agent-1');
  });

  it('should return null when metadata file does not exist', () => {
    const metadata = MetadataGenerator.read(testDir);
    expect(metadata).toBeNull();
  });
});
