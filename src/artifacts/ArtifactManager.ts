import type { Artifact, ArtifactStorage, ArtifactLifecycle } from '@/artifacts/Artifact';

export class ArtifactManager {
  constructor(private storage: ArtifactStorage) {}

  async create(
    id: string,
    name: string,
    owner: string,
    type: string,
    data?: unknown
  ): Promise<Artifact> {
    const artifact: Artifact = {
      id,
      name,
      owner,
      type,
      lifecycle: 'created',
      createdAt: new Date(),
      data,
    };

    await this.storage.store(artifact);
    return artifact;
  }

  async use(id: string): Promise<Artifact | undefined> {
    const artifact = await this.storage.retrieve(id);
    if (!artifact) return undefined;

    artifact.lifecycle = 'used';
    artifact.usedAt = new Date();
    await this.storage.store(artifact);
    return artifact;
  }

  async archive(id: string): Promise<Artifact | undefined> {
    const artifact = await this.storage.retrieve(id);
    if (!artifact) return undefined;

    artifact.lifecycle = 'archived';
    artifact.archivedAt = new Date();
    await this.storage.store(artifact);
    return artifact;
  }

  async getOwnershipInfo(
    id: string
  ): Promise<{ owner: string; lifecycle: ArtifactLifecycle } | undefined> {
    const artifact = await this.storage.retrieve(id);
    if (!artifact) return undefined;

    return {
      owner: artifact.owner,
      lifecycle: artifact.lifecycle,
    };
  }

  async canModify(id: string, requestingAgent: string): Promise<boolean> {
    const artifact = await this.storage.retrieve(id);
    if (!artifact) return false;

    return artifact.owner === requestingAgent;
  }

  async listOwned(owner: string): Promise<Artifact[]> {
    return this.storage.listByOwner(owner);
  }
}
