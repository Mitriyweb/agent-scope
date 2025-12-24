import { ContextHandoff } from '@/flows/ContextHandoff';
import { ArtifactManager } from '@/artifacts/ArtifactManager';
import { InMemoryArtifactStorage } from '@/artifacts/Artifact';

describe('ContextHandoff', () => {
  it('should pass context between agents', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);
    const handoff = new ContextHandoff(manager);

    await manager.create('art-1', 'data', 'agent-a', 'json', { value: 42 });
    const artifacts = await handoff.passContext('agent-a', 'agent-b', ['art-1']);

    expect(artifacts).toHaveLength(1);
  });

  it('should validate context requirements', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);
    const handoff = new ContextHandoff(manager);

    const artifact = await manager.create('art-2', 'data', 'agent-a', 'json');
    const valid = await handoff.validateContext(
      { agentName: 'agent-b', requiredArtifacts: [{ id: 'art-2', name: 'data', type: 'json' }] },
      [artifact]
    );

    expect(valid).toBe(true);
  });

  it('should reject invalid context', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);
    const handoff = new ContextHandoff(manager);

    const artifact = await manager.create('art-3', 'data', 'agent-a', 'json');
    const valid = await handoff.validateContext(
      { agentName: 'agent-b', requiredArtifacts: [{ id: 'missing', name: 'data', type: 'json' }] },
      [artifact]
    );

    expect(valid).toBe(false);
  });

  it('should isolate context per agent', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);
    const handoff = new ContextHandoff(manager);

    const artifact = await manager.create('art-4', 'data', 'agent-a', 'json', { secret: 'value' });
    const isolated = await handoff.isolateContext('agent-b', [artifact]);

    expect(isolated.get('art-4')).toEqual({ secret: 'value' });
  });

  it('should throw on missing artifact', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);
    const handoff = new ContextHandoff(manager);

    await expect(handoff.passContext('agent-a', 'agent-b', ['missing'])).rejects.toThrow();
  });

  it('should handle multiple artifacts in context', async () => {
    const storage = new InMemoryArtifactStorage();
    const manager = new ArtifactManager(storage);
    const handoff = new ContextHandoff(manager);

    await manager.create('art-5', 'data1', 'agent-a', 'json');
    await manager.create('art-6', 'data2', 'agent-a', 'json');
    const artifacts = await handoff.passContext('agent-a', 'agent-b', ['art-5', 'art-6']);

    expect(artifacts).toHaveLength(2);
  });
});
