import type { ArtifactManager } from '@/artifacts/ArtifactManager';
import type { Artifact } from '@/artifacts/Artifact';

export interface ContextRequest {
  agentName: string;
  requiredArtifacts: Array<{ id: string; name: string; type: string }>;
}

export class ContextHandoff {
  constructor(private artifactManager: ArtifactManager) {}

  async passContext(
    _sourceAgent: string,
    _targetAgent: string,
    artifactIds: string[]
  ): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];

    for (const id of artifactIds) {
      const artifact = await this.artifactManager.use(id);
      if (!artifact) {
        throw new Error(`Artifact ${id} not found`);
      }
      artifacts.push(artifact);
    }

    return artifacts;
  }

  async validateContext(request: ContextRequest, availableArtifacts: Artifact[]): Promise<boolean> {
    for (const required of request.requiredArtifacts) {
      const found = availableArtifacts.find(a => a.id === required.id && a.type === required.type);
      if (!found) {
        return false;
      }
    }
    return true;
  }

  async isolateContext(_agentName: string, artifacts: Artifact[]): Promise<Map<string, unknown>> {
    const isolated = new Map<string, unknown>();

    for (const artifact of artifacts) {
      isolated.set(artifact.id, artifact.data);
    }

    return isolated;
  }
}
