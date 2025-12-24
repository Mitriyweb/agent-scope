import { FlowValidator } from '@/flows/FlowValidator';
import type { Flow } from '@/flows/Flow';

describe('FlowValidator', () => {
  it('should validate a valid flow', () => {
    const flow: Flow = {
      name: 'valid-flow',
      version: '1.0.0',
      nodes: {
        'agent-a': { agentName: 'agent-a' },
        'agent-b': { agentName: 'agent-b', inputs: { data: 'agent-a' } },
      },
      edges: [{ from: 'agent-a', to: 'agent-b', artifact: 'data' }],
    };

    const errors = FlowValidator.validate(flow);

    expect(errors).toHaveLength(0);
  });

  it('should detect cycles', () => {
    const flow: Flow = {
      name: 'cyclic-flow',
      version: '1.0.0',
      nodes: {
        'agent-a': { agentName: 'agent-a', inputs: { data: 'agent-b' } },
        'agent-b': { agentName: 'agent-b', inputs: { data: 'agent-a' } },
      },
      edges: [
        { from: 'agent-a', to: 'agent-b', artifact: 'data' },
        { from: 'agent-b', to: 'agent-a', artifact: 'data' },
      ],
    };

    const errors = FlowValidator.validate(flow);

    expect(errors.some(e => e.type === 'cycle')).toBe(true);
  });

  it('should detect missing inputs', () => {
    const flow: Flow = {
      name: 'missing-input-flow',
      version: '1.0.0',
      nodes: {
        'agent-a': { agentName: 'agent-a' },
        'agent-b': { agentName: 'agent-b', inputs: { missing: 'agent-a' } },
      },
      edges: [],
    };

    const errors = FlowValidator.validate(flow);

    expect(errors.some(e => e.type === 'missing_input')).toBe(true);
  });

  it('should detect invalid agent names', () => {
    const flow: Flow = {
      name: 'invalid-agent-flow',
      version: '1.0.0',
      nodes: {
        'agent-a': { agentName: '' },
      },
      edges: [],
    };

    const errors = FlowValidator.validate(flow);

    expect(errors.some(e => e.type === 'missing_agent')).toBe(true);
  });

  it('should validate linear flow', () => {
    const flow: Flow = {
      name: 'linear-flow',
      version: '1.0.0',
      nodes: {
        'agent-a': { agentName: 'agent-a' },
        'agent-b': { agentName: 'agent-b', inputs: { output: 'agent-a' } },
        'agent-c': { agentName: 'agent-c', inputs: { input: 'agent-b' } },
      },
      edges: [
        { from: 'agent-a', to: 'agent-b', artifact: 'output' },
        { from: 'agent-b', to: 'agent-c', artifact: 'input' },
      ],
    };

    const errors = FlowValidator.validate(flow);

    expect(errors).toHaveLength(0);
  });

  it('should validate fan-out flow', () => {
    const flow: Flow = {
      name: 'fan-out-flow',
      version: '1.0.0',
      nodes: {
        'agent-a': { agentName: 'agent-a' },
        'agent-b': { agentName: 'agent-b', inputs: { data: 'agent-a' } },
        'agent-c': { agentName: 'agent-c', inputs: { data: 'agent-a' } },
      },
      edges: [
        { from: 'agent-a', to: 'agent-b', artifact: 'data' },
        { from: 'agent-a', to: 'agent-c', artifact: 'data' },
      ],
    };

    const errors = FlowValidator.validate(flow);

    expect(errors).toHaveLength(0);
  });

  it('should validate fan-in flow', () => {
    const flow: Flow = {
      name: 'fan-in-flow',
      version: '1.0.0',
      nodes: {
        'agent-a': { agentName: 'agent-a' },
        'agent-b': { agentName: 'agent-b' },
        'agent-c': { agentName: 'agent-c', inputs: { input1: 'agent-a', input2: 'agent-b' } },
      },
      edges: [
        { from: 'agent-a', to: 'agent-c', artifact: 'input1' },
        { from: 'agent-b', to: 'agent-c', artifact: 'input2' },
      ],
    };

    const errors = FlowValidator.validate(flow);

    expect(errors).toHaveLength(0);
  });

  it('should report multiple errors', () => {
    const flow: Flow = {
      name: 'multi-error-flow',
      version: '1.0.0',
      nodes: {
        'agent-a': { agentName: '' },
        'agent-b': { agentName: 'agent-b', inputs: { missing: 'agent-a' } },
      },
      edges: [],
    };

    const errors = FlowValidator.validate(flow);

    expect(errors.length).toBeGreaterThan(1);
  });
});
