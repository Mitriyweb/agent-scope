import { ArtifactManager } from '@/artifacts/ArtifactManager';
import { InMemoryArtifactStorage } from '@/artifacts/Artifact';

describe('ArtifactManager', () => {
  it('should create artifact', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);

    const artifact = await manager.create('art-1', 'data', 'agent-a', 'json');

    expect(artifact.lifecycle).toBe('created');
  });

  it('should transition artifact to used', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);

    await manager.create('art-2', 'data', 'agent-a', 'json');
    const used = await manager.use('art-2');

    expect(used?.lifecycle).toBe('used');
  });

  it('should transition artifact to archived', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);

    await manager.create('art-3', 'data', 'agent-a', 'json');
    const archived = await manager.archive('art-3');

    expect(archived?.lifecycle).toBe('archived');
  });

  it('should track ownership', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);

    await manager.create('art-4', 'data', 'agent-a', 'json');
    const ownership = await manager.getOwnershipInfo('art-4');

    expect(ownership?.owner).toBe('agent-a');
  });

  it('should prevent unauthorized modification', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);

    await manager.create('art-5', 'data', 'agent-a', 'json');
    const canModify = await manager.canModify('art-5', 'agent-b');

    expect(canModify).toBe(false);
  });

  it('should allow owner modification', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);

    await manager.create('art-6', 'data', 'agent-a', 'json');
    const canModify = await manager.canModify('art-6', 'agent-a');

    expect(canModify).toBe(true);
  });

  it('should list owned artifacts', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);

    await manager.create('art-7', 'data1', 'agent-a', 'json');
    await manager.create('art-8', 'data2', 'agent-a', 'json');
    const owned = await manager.listOwned('agent-a');

    expect(owned).toHaveLength(2);
  });
});
