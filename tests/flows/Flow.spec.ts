import type { Flow } from '@/flows/Flow';

describe('Flow', () => {
  it('should create a valid flow', () => {
    const flow: Flow = {
      name: 'test-flow',
      version: '1.0.0',
      nodes: {
        'agent-a': {
          agentName: 'agent-a',
        },
      },
      edges: [],
    };

    expect(flow.name).toBe('test-flow');
  });

  it('should support flow with multiple nodes', () => {
    const flow: Flow = {
      name: 'multi-agent-flow',
      version: '1.0.0',
      nodes: {
        'agent-a': { agentName: 'agent-a' },
        'agent-b': { agentName: 'agent-b', inputs: { data: 'agent-a' } },
      },
      edges: [{ from: 'agent-a', to: 'agent-b', artifact: 'data' }],
    };

    expect(Object.keys(flow.nodes)).toHaveLength(2);
  });

  it('should support flow with inputs mapping', () => {
    const flow: Flow = {
      name: 'flow-with-inputs',
      version: '1.0.0',
      nodes: {
        'agent-b': {
          agentName: 'agent-b',
          inputs: { input1: 'agent-a', input2: 'agent-c' },
        },
      },
      edges: [],
    };

    expect(flow.nodes['agent-b'].inputs).toEqual({ input1: 'agent-a', input2: 'agent-c' });
  });

  it('should track edges between nodes', () => {
    const flow: Flow = {
      name: 'flow-with-edges',
      version: '1.0.0',
      nodes: {
        'agent-a': { agentName: 'agent-a' },
        'agent-b': { agentName: 'agent-b' },
      },
      edges: [{ from: 'agent-a', to: 'agent-b', artifact: 'output' }],
    };

    expect(flow.edges).toHaveLength(1);
    expect(flow.edges[0].artifact).toBe('output');
  });
});
