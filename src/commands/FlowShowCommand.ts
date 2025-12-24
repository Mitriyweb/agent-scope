import { FlowParser } from '@/flows/FlowParser';

export class FlowShowCommand {
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('Usage: agent-scope flow show <flow-file>');
      return;
    }

    const filePath = args[0];

    try {
      const fs = await import('fs');
      const content = fs.readFileSync(filePath, 'utf-8');
      const flow = FlowParser.parseJSON(content);

      console.log(`Flow: ${flow.name} (v${flow.version})`);
      console.log(`Nodes: ${Object.keys(flow.nodes).length}`);
      console.log(`Edges: ${flow.edges.length}`);
      console.log('\nNodes:');
      for (const [id, node] of Object.entries(flow.nodes)) {
        console.log(`  - ${id}: ${node.agentName}`);
        if (node.inputs) {
          for (const [input, source] of Object.entries(node.inputs)) {
            console.log(`    input: ${input} from ${source}`);
          }
        }
      }
    } catch (error) {
      console.error(
        `Error showing flow: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
