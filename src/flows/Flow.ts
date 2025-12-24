export interface FlowNode {
  agentName: string;
  inputs?: Record<string, string>; // artifact name -> source node output
}

export interface Flow {
  name: string;
  version: string;
  nodes: Record<string, FlowNode>; // node id -> node definition
  edges: Array<{ from: string; to: string; artifact: string }>; // artifact flow
}

export interface FlowValidationError {
  type: 'cycle' | 'missing_input' | 'type_mismatch' | 'missing_agent';
  message: string;
  nodeId?: string;
}

export class FlowError extends Error {
  constructor(
    message: string,
    public errors: FlowValidationError[] = []
  ) {
    super(message);
    this.name = 'FlowError';
  }
}
