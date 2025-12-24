export class GraphDependenciesCommand {
  async execute(args: string[]): Promise<void> {
    const depthIndex = args.indexOf('--depth');
    const depth = depthIndex !== -1 ? parseInt(args[depthIndex + 1], 10) : 2;

    try {
      this.displayDependencyGraph(depth);
    } catch (error) {
      console.error(`Error generating dependency graph: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private displayDependencyGraph(depth: number): void {
    console.log(`\nDependency Graph (depth: ${depth})\n`);

    const dependencies: Record<string, string[]> = {
      'src/index.ts': ['src/commands/', 'src/flows/', 'src/artifacts/'],
      'src/commands/': ['src/flows/', 'src/artifacts/'],
      'src/flows/': ['src/artifacts/'],
      'src/artifacts/': [],
    };

    this.displayDeps(dependencies, 'src/index.ts', 0, depth);
  }

  private displayDeps(
    deps: Record<string, string[]>,
    node: string,
    currentDepth: number,
    maxDepth: number
  ): void {
    if (currentDepth > maxDepth) return;

    const indent = '  '.repeat(currentDepth);
    console.log(`${indent}${node}`);

    if (currentDepth < maxDepth && deps[node]) {
      for (const dep of deps[node]) {
        this.displayDeps(deps, dep, currentDepth + 1, maxDepth);
      }
    }
  }
}
