export interface Template {
  name: string;
  description: string;
  files: Record<string, string>;
}

export class TemplateManager {
  private templates: Record<string, Template> = {
    'basic-flow': {
      name: 'basic-flow',
      description: 'Basic agent flow with two nodes',
      files: {
        'flow.json': JSON.stringify(
          {
            name: 'basic-flow',
            version: '1.0.0',
            nodes: {
              analyzer: { agentName: 'analyzer' },
              processor: { agentName: 'processor', inputs: { data: 'analyzer' } },
            },
            edges: [{ from: 'analyzer', to: 'processor', artifact: 'data' }],
          },
          null,
          2
        ),
      },
    },
    'multi-agent': {
      name: 'multi-agent',
      description: 'Multi-agent workflow with parallel execution',
      files: {
        'flow.json': JSON.stringify(
          {
            name: 'multi-agent-flow',
            version: '1.0.0',
            nodes: {
              analyzer: { agentName: 'analyzer' },
              processor1: { agentName: 'processor', inputs: { data: 'analyzer' } },
              processor2: { agentName: 'processor', inputs: { data: 'analyzer' } },
              aggregator: {
                agentName: 'aggregator',
                inputs: { result1: 'processor1', result2: 'processor2' },
              },
            },
            edges: [
              { from: 'analyzer', to: 'processor1', artifact: 'data' },
              { from: 'analyzer', to: 'processor2', artifact: 'data' },
              { from: 'processor1', to: 'aggregator', artifact: 'result1' },
              { from: 'processor2', to: 'aggregator', artifact: 'result2' },
            ],
          },
          null,
          2
        ),
      },
    },
  };

  listTemplates(): Template[] {
    return Object.values(this.templates);
  }

  getTemplate(name: string): Template | undefined {
    return this.templates[name];
  }

  createFromTemplate(name: string, projectPath: string): boolean {
    const template = this.getTemplate(name);
    if (!template) return false;

    for (const [fileName] of Object.entries(template.files)) {
      console.log(`Creating ${projectPath}/${fileName}`);
    }

    return true;
  }
}
