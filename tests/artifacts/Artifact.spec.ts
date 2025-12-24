import { InMemoryArtifactStorage } from '@/artifacts/Artifact';
import type { Artifact } from '@/artifacts/Artifact';

describe('Artifact', () => {
  it('should create and store artifact', async () => {
    const storage = new InMemoryArtifactStorage();
    const artifact: Artifact = {
      id: 'art-1',
      name: 'test-artifact',
      owner: 'agent-a',
      type: 'json',
      lifecycle: 'created',
      createdAt: new Date(),
    };

    await storage.store(artifact);
    const retrieved = await storage.retrieve('art-1');

    expect(retrieved?.name).toBe('test-artifact');
  });

  it('should retrieve artifact by id', async () => {
    const storage = new InMemoryArtifactStorage();
    const artifact: Artifact = {
      id: 'art-2',
      name: 'data',
      owner: 'agent-b',
      type: 'json',
      lifecycle: 'created',
      createdAt: new Date(),
    };

    await storage.store(artifact);
    const retrieved = await storage.retrieve('art-2');

    expect(retrieved?.owner).toBe('agent-b');
  });

  it('should delete artifact', async () => {
    const storage = new InMemoryArtifactStorage();
    const artifact: Artifact = {
      id: 'art-3',
      name: 'temp',
      owner: 'agent-c',
      type: 'text',
      lifecycle: 'created',
      createdAt: new Date(),
    };

    await storage.store(artifact);
    await storage.delete('art-3');
    const retrieved = await storage.retrieve('art-3');

    expect(retrieved).toBeUndefined();
  });

  it('should list artifacts by owner', async () => {
    const storage = new InMemoryArtifactStorage();
    const art1: Artifact = {
      id: 'art-4',
      name: 'data1',
      owner: 'agent-a',
      type: 'json',
      lifecycle: 'created',
      createdAt: new Date(),
    };
    const art2: Artifact = {
      id: 'art-5',
      name: 'data2',
      owner: 'agent-a',
      type: 'json',
      lifecycle: 'created',
      createdAt: new Date(),
    };

    await storage.store(art1);
    await storage.store(art2);
    const owned = await storage.listByOwner('agent-a');

    expect(owned).toHaveLength(2);
  });

  it('should track artifact lifecycle', async () => {
    const storage = new InMemoryArtifactStorage();
    const artifact: Artifact = {
      id: 'art-6',
      name: 'lifecycle-test',
      owner: 'agent-d',
      type: 'json',
      lifecycle: 'created',
      createdAt: new Date(),
    };

    await storage.store(artifact);
    const retrieved = await storage.retrieve('art-6');

    expect(retrieved?.lifecycle).toBe('created');
  });
});
