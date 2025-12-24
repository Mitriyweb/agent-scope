import { ExecutionEngine } from '@/execution/ExecutionEngine';
import type { Agent } from '@/types/Agent';
import { Role } from '@/enums/Role';

describe('ExecutionEngine', () => {
  let engine: ExecutionEngine;

  beforeEach(() => {
    engine = new ExecutionEngine();
  });

  afterEach(() => {
    engine.clearResults();
  });

  const createTestAgent = (name: string): Agent => ({
    name,
    role: Role.DEVELOPER,
    scope: {
      patterns: ['src/**'],
      readOnly: false,
    },
  });

  describe('execute', () => {
    it('should execute a simple command successfully', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'echo "hello"');

      expect(result.state).toBe('completed');
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('hello');
      expect(result.agentName).toBe('test-agent');
    });

    it('should capture stderr on command failure', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'echo "error" >&2; exit 1');

      expect(result.state).toBe('failed');
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('error');
    });

    it('should set execution state to running', async () => {
      const agent = createTestAgent('test-agent');
      let stateOnStart = '';

      engine.on('execution:start', () => {
        stateOnStart = 'running';
      });

      await engine.execute(agent, 'echo "test"');
      expect(stateOnStart).toBe('running');
    });

    it('should emit execution events', async () => {
      const agent = createTestAgent('test-agent');
      const events: string[] = [];

      engine.on('execution:start', () => events.push('start'));
      engine.on('execution:end', () => events.push('end'));

      await engine.execute(agent, 'echo "test"');

      expect(events).toContain('start');
      expect(events).toContain('end');
    });

    it('should track execution time', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'sleep 0.1; echo "done"');

      expect(result.startTime).toBeDefined();
      expect(result.endTime).toBeDefined();
      expect(result.endTime!.getTime()).toBeGreaterThanOrEqual(result.startTime.getTime());
    });
  });

  describe('timeout', () => {
    it('should support timeout option', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'echo "test"', { timeout: 5000 });

      expect(result.state).toBe('completed');
      expect(result.exitCode).toBe(0);
    });
  });

  describe('cancel', () => {
    it('should return false when cancelling non-existent execution', () => {
      const result = engine.cancel('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('results', () => {
    it('should store execution results', async () => {
      const agent = createTestAgent('test-agent');
      await engine.execute(agent, 'echo "test"');

      const results = engine.getAllResults();
      expect(results.length).toBe(1);
      expect(results[0].agentName).toBe('test-agent');
    });

    it('should clear all results', async () => {
      const agent = createTestAgent('test-agent');
      await engine.execute(agent, 'echo "test"');
      await engine.execute(agent, 'echo "test2"');

      expect(engine.getAllResults().length).toBe(2);
      engine.clearResults();
      expect(engine.getAllResults().length).toBe(0);
    });
  });
});
