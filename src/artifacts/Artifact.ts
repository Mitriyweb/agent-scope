export type ArtifactLifecycle = 'created' | 'used' | 'archived';

export interface Artifact {
  id: string;
  name: string;
  owner: string;
  type: string;
  lifecycle: ArtifactLifecycle;
  createdAt: Date;
  usedAt?: Date;
  archivedAt?: Date;
  data?: unknown;
}

export interface ArtifactStorage {
  store(artifact: Artifact): Promise<void>;
  retrieve(id: string): Promise<Artifact | undefined>;
  delete(id: string): Promise<void>;
  listByOwner(owner: string): Promise<Artifact[]>;
}

export class InMemoryArtifactStorage implements ArtifactStorage {
  private artifacts = new Map<string, Artifact>();

  async store(artifact: Artifact): Promise<void> {
    this.artifacts.set(artifact.id, artifact);
  }

  async retrieve(id: string): Promise<Artifact | undefined> {
    return this.artifacts.get(id);
  }

  async delete(id: string): Promise<void> {
    this.artifacts.delete(id);
  }

  async listByOwner(owner: string): Promise<Artifact[]> {
    return Array.from(this.artifacts.values()).filter(a => a.owner === owner);
  }
}
