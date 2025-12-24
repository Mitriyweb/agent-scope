import { FlowParser } from '@/flows/FlowParser';
import { FlowValidator } from '@/flows/FlowValidator';
import type { Flow } from '@/flows/Flow';

export class ExplainFlowCommand {
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('Usage: agent-scope explain flow <flow-file> [--nodes] [--edges]');
      return;
    }

    const filePath = args[0];
    const showNodes = args.includes('--nodes');
    const showEdges = args.includes('--edges');
    const showAll = !showNodes && !showEdges;

    try {
      const fs = await import('fs');
      const content = fs.readFileSync(filePath, 'utf-8');
      const flow = FlowParser.parseJSON(content);

      this.displayFlowOverview(flow);

      if (showAll || showNodes) {
        this.displayNodes(flow);
      }

      if (showAll || showEdges) {
        this.displayEdges(flow);
      }
    } catch (error) {
      console.error(`Error explaining flow: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private displayFlowOverview(flow: Flow): void {
    console.log(`\nFlow: ${flow.name}`);
    console.log(`Version: ${flow.version}`);
    console.log(`Nodes: ${Object.keys(flow.nodes).length}`);
    console.log(`Edges: ${flow.edges.length}`);

    const errors = FlowValidator.validate(flow);
    if (errors.length === 0) {
      console.log('Status: ✅ Valid');
    } else {
      console.log(`Status: ❌ ${errors.length} error(s)`);
    }
  }

  private displayNodes(flow: Flow): void {
    console.log('\nNodes:');
    for (const [id, node] of Object.entries(flow.nodes)) {
      console.log(`  ${id}`);
      console.log(`    Agent: ${node.agentName}`);
      if (node.inputs && Object.keys(node.inputs).length > 0) {
        console.log('    Inputs:');
        for (const [input, source] of Object.entries(node.inputs)) {
          console.log(`      ${input} from ${source}`);
        }
      }
    }
  }

  private displayEdges(flow: Flow): void {
    console.log('\nEdges:');
    for (const edge of flow.edges) {
      console.log(`  ${edge.from} → ${edge.to}`);
      console.log(`    Artifact: ${edge.artifact}`);
    }
  }
}
