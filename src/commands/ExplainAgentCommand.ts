export class ExplainAgentCommand {
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('Usage: agent-scope explain agent <agent-name> [--capabilities]');
      return;
    }

    const agentName = args[0];
    const showCapabilities = args.includes('--capabilities');

    try {
      this.displayAgentDetails(agentName);

      if (showCapabilities) {
        this.displayCapabilities(agentName);
      }
    } catch (error) {
      console.error(`Error explaining agent: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private displayAgentDetails(agentName: string): void {
    console.log(`\nAgent: ${agentName}`);
    console.log(`Role: developer`);
    console.log(`Scope: src/`);
    console.log(`Status: active`);
  }

  private displayCapabilities(_agentName: string): void {
    console.log('\nCapabilities:');
    console.log(`  - Code analysis`);
    console.log(`  - File modification`);
    console.log(`  - Test execution`);
  }
}
