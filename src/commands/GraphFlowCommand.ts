import { FlowParser } from '@/flows/FlowParser';
import type { Flow } from '@/flows/Flow';

export class GraphFlowCommand {
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('Usage: agent-scope graph flow <flow-file> [--labels] [--format json]');
      return;
    }

    const filePath = args[0];
    const showLabels = args.includes('--labels');
    const formatJson = args.includes('--format') && args[args.indexOf('--format') + 1] === 'json';

    try {
      const fs = await import('fs');
      const content = fs.readFileSync(filePath, 'utf-8');
      const flow = FlowParser.parseJSON(content);

      if (formatJson) {
        this.displayAsJson(flow);
      } else {
        this.displayAsAscii(flow, showLabels);
      }
    } catch (error) {
      console.error(
        `Error generating graph: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private displayAsAscii(flow: Flow, showLabels: boolean): void {
    console.log(`\nFlow: ${flow.name}\n`);

    const nodeIds = Object.keys(flow.nodes);
    for (const nodeId of nodeIds) {
      const node = flow.nodes[nodeId];
      console.log(`[${nodeId}] ${node.agentName}`);

      const outgoing = flow.edges.filter(e => e.from === nodeId);
      for (const edge of outgoing) {
        const label = showLabels ? ` (${edge.artifact})` : '';
        console.log(`  └─${label} ──> [${edge.to}]`);
      }
    }
  }

  private displayAsJson(flow: Flow): void {
    const graph = {
      name: flow.name,
      version: flow.version,
      nodes: Object.entries(flow.nodes).map(([id, node]) => ({
        id,
        agent: node.agentName,
        inputs: node.inputs ?? {},
      })),
      edges: flow.edges.map(edge => ({
        from: edge.from,
        to: edge.to,
        artifact: edge.artifact,
      })),
    };

    console.log(JSON.stringify(graph, null, 2));
  }
}
