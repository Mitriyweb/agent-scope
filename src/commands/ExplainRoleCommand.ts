export class ExplainRoleCommand {
  private readonly roles = ['developer', 'qa', 'architect', 'reviewer'];

  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('Usage: agent-scope explain role <role-name> [--agents]');
      return;
    }

    const roleName = args[0];
    const showAgents = args.includes('--agents');

    if (!this.roles.includes(roleName)) {
      console.error(`Unknown role: ${roleName}`);
      console.log(`Available roles: ${this.roles.join(', ')}`);
      return;
    }

    try {
      this.displayRoleDetails(roleName);

      if (showAgents) {
        this.displayAgents(roleName);
      }
    } catch (error) {
      console.error(`Error explaining role: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private displayRoleDetails(roleName: string): void {
    const descriptions: Record<string, string> = {
      developer: 'Develops and implements features',
      qa: 'Tests and validates functionality',
      architect: 'Designs system architecture',
      reviewer: 'Reviews and approves changes',
    };

    console.log(`\nRole: ${roleName}`);
    console.log(`Description: ${descriptions[roleName]}`);
    console.log('Responsibilities:');
    console.log(`  - Code quality`);
    console.log(`  - Testing`);
    console.log(`  - Documentation`);
  }

  private displayAgents(roleName: string): void {
    console.log('\nAgents with this role:');
    console.log(`  - agent-${roleName}-1`);
    console.log(`  - agent-${roleName}-2`);
  }
}
