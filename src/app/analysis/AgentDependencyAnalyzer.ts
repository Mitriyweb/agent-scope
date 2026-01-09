import * as fs from 'fs';
import * as path from 'path';
import type { WorkflowDependency } from '@/types/AgentScope';

/**
 * Analyzes dependencies between agents and workflows
 */
export class AgentDependencyAnalyzer {
  private workflowsDir: string;

  constructor(workflowsDir: string = '.agent/workflows') {
    this.workflowsDir = workflowsDir;
  }

  /**
   * Find all workflows that use a specific agent
   */
  findWorkflowsUsingAgent(agentName: string): WorkflowDependency[] {
    const dependencies: WorkflowDependency[] = [];

    // Check if workflows directory exists
    if (!fs.existsSync(this.workflowsDir)) {
      return dependencies;
    }

    // Read all workflow files
    const files = fs.readdirSync(this.workflowsDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(this.workflowsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      // Search for agent references in the file
      lines.forEach((line, index) => {
        // Match patterns like: **Agent:** `agentName` or Agent: agentName
        const agentPattern = new RegExp(
          `\\*\\*Agent:\\*\\*\\s*\`${agentName}\`|Agent:\\s*${agentName}`,
          'i'
        );
        if (agentPattern.test(line)) {
          dependencies.push({
            workflow: file,
            line: index + 1, // Line numbers start at 1
            context: line.trim(),
          });
        }
      });
    }

    return dependencies;
  }

  /**
   * Format dependency warning message for agent removal
   */
  formatDependencyWarning(agentName: string, dependencies: WorkflowDependency[]): string {
    if (dependencies.length === 0) {
      return '';
    }

    const workflowList = dependencies.map(d => `- ${d.workflow} (line ${d.line})`).join('\n');

    return `
⚠️  Role '${agentName}' is used in workflows:
${workflowList}

Remove anyway? [y/N]
`;
  }

  /**
   * Check if agent has any dependencies
   */
  hasDependencies(agentName: string): boolean {
    return this.findWorkflowsUsingAgent(agentName).length > 0;
  }
}
