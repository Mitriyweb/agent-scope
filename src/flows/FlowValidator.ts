import type { Flow, FlowValidationError } from '@/flows/Flow';

export class FlowValidator {
  static validate(flow: Flow): FlowValidationError[] {
    const errors: FlowValidationError[] = [];

    errors.push(...this.detectCycles(flow));
    errors.push(...this.validateInputOutput(flow));
    errors.push(...this.validateAgents(flow));

    return errors;
  }

  private static detectCycles(flow: Flow): FlowValidationError[] {
    const errors: FlowValidationError[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const node = flow.nodes[nodeId];
      if (!node) return false;

      const dependencies = flow.edges.filter(e => e.to === nodeId).map(e => e.from);

      for (const dep of dependencies) {
        if (!visited.has(dep)) {
          if (hasCycle(dep)) return true;
        } else if (recursionStack.has(dep)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const nodeId of Object.keys(flow.nodes)) {
      if (!visited.has(nodeId)) {
        if (hasCycle(nodeId)) {
          errors.push({
            type: 'cycle',
            message: `Cycle detected involving node ${nodeId}`,
            nodeId,
          });
        }
      }
    }

    return errors;
  }

  private static validateInputOutput(flow: Flow): FlowValidationError[] {
    const errors: FlowValidationError[] = [];
    const nodeOutputs = new Map<string, Set<string>>();

    // Build output map
    for (const edge of flow.edges) {
      if (!nodeOutputs.has(edge.from)) {
        nodeOutputs.set(edge.from, new Set());
      }
      const outputs = nodeOutputs.get(edge.from);
      if (outputs) {
        outputs.add(edge.artifact);
      }
    }

    // Validate inputs
    for (const [nodeId, node] of Object.entries(flow.nodes)) {
      if (!node.inputs) continue;

      for (const [inputName, sourceNode] of Object.entries(node.inputs)) {
        const outputs = nodeOutputs.get(sourceNode);
        if (!outputs || !outputs.has(inputName)) {
          errors.push({
            type: 'missing_input',
            message: `Node ${nodeId} requires input ${inputName} from ${sourceNode}, but ${sourceNode} does not produce it`,
            nodeId,
          });
        }
      }
    }

    return errors;
  }

  private static validateAgents(flow: Flow): FlowValidationError[] {
    const errors: FlowValidationError[] = [];

    for (const [nodeId, node] of Object.entries(flow.nodes)) {
      if (!node.agentName || typeof node.agentName !== 'string') {
        errors.push({
          type: 'missing_agent',
          message: `Node ${nodeId} does not have a valid agent name`,
          nodeId,
        });
      }
    }

    return errors;
  }
}
