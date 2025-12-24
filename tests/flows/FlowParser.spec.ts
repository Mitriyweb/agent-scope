import { FlowParser } from '@/flows/FlowParser';

describe('FlowParser', () => {
  it('should parse valid JSON flow', () => {
    const json = JSON.stringify({
      name: 'test-flow',
      version: '1.0.0',
      nodes: { 'agent-a': { agentName: 'agent-a' } },
      edges: [],
    });

    const flow = FlowParser.parseJSON(json);

    expect(flow.name).toBe('test-flow');
  });

  it('should throw on invalid JSON', () => {
    expect(() => FlowParser.parseJSON('invalid json')).toThrow();
  });

  it('should throw on missing name', () => {
    const json = JSON.stringify({
      version: '1.0.0',
      nodes: {},
      edges: [],
    });

    expect(() => FlowParser.parseJSON(json)).toThrow('name');
  });

  it('should throw on missing version', () => {
    const json = JSON.stringify({
      name: 'test',
      nodes: {},
      edges: [],
    });

    expect(() => FlowParser.parseJSON(json)).toThrow('version');
  });

  it('should throw on missing nodes', () => {
    const json = JSON.stringify({
      name: 'test',
      version: '1.0.0',
      edges: [],
    });

    expect(() => FlowParser.parseJSON(json)).toThrow('nodes');
  });

  it('should serialize flow to JSON', () => {
    const flow = {
      name: 'test-flow',
      version: '1.0.0',
      nodes: { 'agent-a': { agentName: 'agent-a' } },
      edges: [],
    };

    const json = FlowParser.serialize(flow);
    const parsed = JSON.parse(json);

    expect(parsed.name).toBe('test-flow');
  });

  it('should parse flow with multiple nodes', () => {
    const json = JSON.stringify({
      name: 'multi-flow',
      version: '1.0.0',
      nodes: {
        'agent-a': { agentName: 'agent-a' },
        'agent-b': { agentName: 'agent-b' },
      },
      edges: [],
    });

    const flow = FlowParser.parseJSON(json);

    expect(Object.keys(flow.nodes)).toHaveLength(2);
  });

  it('should parse flow with edges', () => {
    const json = JSON.stringify({
      name: 'flow-with-edges',
      version: '1.0.0',
      nodes: {
        'agent-a': { agentName: 'agent-a' },
        'agent-b': { agentName: 'agent-b' },
      },
      edges: [{ from: 'agent-a', to: 'agent-b', artifact: 'output' }],
    });

    const flow = FlowParser.parseJSON(json);

    expect(flow.edges).toHaveLength(1);
  });
});
