import type { Flow, FlowNode } from '@/flows/Flow';

export class FlowParser {
  static parseJSON(json: string): Flow {
    try {
      const data = JSON.parse(json);
      return this.validateFlowStructure(data);
    } catch (error) {
      throw new Error(
        `Failed to parse flow JSON: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  static parseYAML(_yaml: string): Flow {
    // Basic YAML parsing (simplified for now)
    // In production, would use a proper YAML parser
    throw new Error('YAML parsing not yet implemented');
  }

  private static validateFlowStructure(data: unknown): Flow {
    if (!data || typeof data !== 'object') {
      throw new Error('Flow must be an object');
    }

    const flow = data as Record<string, unknown>;

    if (typeof flow.name !== 'string' || !flow.name) {
      throw new Error('Flow must have a non-empty name');
    }

    if (typeof flow.version !== 'string' || !flow.version) {
      throw new Error('Flow must have a version');
    }

    if (!flow.nodes || typeof flow.nodes !== 'object') {
      throw new Error('Flow must have nodes');
    }

    const nodes: Record<string, FlowNode> = {};
    const rawNodes = flow.nodes as Record<string, unknown>;

    for (const [nodeId, nodeData] of Object.entries(rawNodes)) {
      if (!nodeData || typeof nodeData !== 'object') {
        throw new Error(`Node ${nodeId} must be an object`);
      }

      const node = nodeData as Record<string, unknown>;
      if (typeof node.agentName !== 'string' || !node.agentName) {
        throw new Error(`Node ${nodeId} must have a non-empty agentName`);
      }

      nodes[nodeId] = {
        agentName: node.agentName,
        inputs:
          node.inputs && typeof node.inputs === 'object'
            ? (node.inputs as Record<string, string>)
            : undefined,
      };
    }

    return {
      name: flow.name,
      version: flow.version,
      nodes,
      edges: Array.isArray(flow.edges)
        ? (flow.edges as Array<{ from: string; to: string; artifact: string }>)
        : [],
    };
  }

  static serialize(flow: Flow): string {
    return JSON.stringify(flow, null, 2);
  }
}
