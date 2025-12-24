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
    });

    it('should return exit code 0 on success', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'echo "hello"');
      expect(result.exitCode).toBe(0);
    });

    it('should capture stdout output', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'echo "hello"');
      expect(result.stdout).toContain('hello');
    });

    it('should track agent name in result', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'echo "hello"');
      expect(result.agentName).toBe('test-agent');
    });

    it('should mark failed commands with failed state', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'echo "error" >&2; exit 1');
      expect(result.state).toBe('failed');
    });

    it('should capture exit code on failure', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'echo "error" >&2; exit 1');
      expect(result.exitCode).toBe(1);
    });

    it('should capture stderr output', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'echo "error" >&2; exit 1');
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

    it('should emit execution start event', async () => {
      const agent = createTestAgent('test-agent');
      const events: string[] = [];
      engine.on('execution:start', () => events.push('start'));
      await engine.execute(agent, 'echo "test"');
      expect(events).toContain('start');
    });

    it('should emit execution end event', async () => {
      const agent = createTestAgent('test-agent');
      const events: string[] = [];
      engine.on('execution:end', () => events.push('end'));
      await engine.execute(agent, 'echo "test"');
      expect(events).toContain('end');
    });

    it('should record start time', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'sleep 0.1; echo "done"');
      expect(result.startTime).toBeDefined();
    });

    it('should record end time', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'sleep 0.1; echo "done"');
      expect(result.endTime).toBeDefined();
    });

    it('should have end time after start time', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'sleep 0.1; echo "done"');
      expect(result.endTime!.getTime()).toBeGreaterThanOrEqual(result.startTime.getTime());
    });
  });

  describe('timeout', () => {
    it('should support timeout option', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'echo "test"', { timeout: 5000 });
      expect(result.state).toBe('completed');
    });

    it('should handle command with custom cwd', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'pwd', { cwd: '/tmp' });

      expect(result.state).toBe('completed');
      expect(result.exitCode).toBe(0);
    });
  });

  describe('cancel', () => {
    it('should return false when cancelling non-existent execution', () => {
      const result = engine.cancel('non-existent-id');
      expect(result).toBe(false);
    });

    it('should mark execution as failed on error', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'exit 42');
      expect(result.state).toBe('failed');
    });

    it('should capture exit code on error', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'exit 42');
      expect(result.exitCode).toBe(42);
    });

    it('should include error details', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'exit 42');
      expect(result.error).toBeDefined();
    });
  });

  describe('results', () => {
    it('should store execution results', async () => {
      const agent = createTestAgent('test-agent');
      await engine.execute(agent, 'echo "test"');
      const results = engine.getAllResults();
      expect(results.length).toBe(1);
    });

    it('should include agent name in stored results', async () => {
      const agent = createTestAgent('test-agent');
      await engine.execute(agent, 'echo "test"');
      const results = engine.getAllResults();
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

    it('should track start time as Date', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'echo "test"');
      expect(result.startTime).toBeInstanceOf(Date);
    });

    it('should track end time as Date', async () => {
      const agent = createTestAgent('test-agent');
      const result = await engine.execute(agent, 'echo "test"');
      expect(result.endTime).toBeInstanceOf(Date);
    });

    it('should emit execution events', async () => {
      const agent = createTestAgent('test-agent');
      const events: string[] = [];

      engine.on('execution:start', () => events.push('start'));
      engine.on('execution:end', () => events.push('end'));
      engine.on('execution:output', () => events.push('output'));

      await engine.execute(agent, 'echo "test"');

      expect(events).toContain('start');
      expect(events).toContain('end');
      expect(events).toContain('output');
    });

    it('should handle multiple sequential executions', async () => {
      const agent = createTestAgent('test-agent');
      await engine.execute(agent, 'echo "first"');
      await engine.execute(agent, 'echo "second"');
      expect(engine.getAllResults().length).toBe(2);
    });
  });
});
