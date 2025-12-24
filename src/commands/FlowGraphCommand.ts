import { FlowParser } from '@/flows/FlowParser';
import type { Flow } from '@/flows/Flow';

export class FlowGraphCommand {
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('Usage: agent-scope flow graph <flow-file>');
      return;
    }

    const filePath = args[0];

    try {
      const fs = await import('fs');
      const content = fs.readFileSync(filePath, 'utf-8');
      const flow = FlowParser.parseJSON(content);

      console.log(`Flow Graph: ${flow.name}`);
      console.log('');
      this.printGraph(flow);
    } catch (error) {
      console.error(
        `Error generating graph: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private printGraph(flow: Flow): void {
    const nodeIds = Object.keys(flow.nodes);

    for (const nodeId of nodeIds) {
      const node = flow.nodes[nodeId];
      console.log(`[${nodeId}] ${node.agentName}`);

      const outgoing = flow.edges.filter(e => e.from === nodeId);
      for (const edge of outgoing) {
        console.log(`  └─ ${edge.artifact} ──> [${edge.to}]`);
      }
    }
  }
}
