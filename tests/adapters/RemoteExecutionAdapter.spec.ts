import { RemoteExecutionAdapter } from '@/adapters/RemoteExecutionAdapter';
import ExecutionStatus from '@/types/ExecutionStatus';

describe('RemoteExecutionAdapter', () => {
  let adapter: RemoteExecutionAdapter;

  beforeEach(() => {
    adapter = new RemoteExecutionAdapter({
      endpoint: 'http://localhost:3000/execute',
      timeout: 5000,
      retries: 2,
      retryDelay: 100,
    });
  });

  describe('name property', () => {
    it('should have name "remote"', () => {
      expect(adapter.name).toBe('remote');
    });
  });

  describe('constructor', () => {
    it('should initialize with config', () => {
      const config = {
        endpoint: 'http://example.com/api',
        timeout: 10000,
        retries: 3,
        retryDelay: 500,
      };

      const customAdapter = new RemoteExecutionAdapter(config);
      expect(customAdapter.name).toBe('remote');
    });

    it('should handle minimal config', () => {
      const minimalAdapter = new RemoteExecutionAdapter({
        endpoint: 'http://localhost:3000/execute',
      });

      expect(minimalAdapter.name).toBe('remote');
    });
  });

  describe('execute', () => {
    it('should handle execution failure gracefully', async () => {
      const result = await adapter.execute('test command');

      expect(result.id).toBeDefined();
      expect(result.status).toBe(ExecutionStatus.Failed);
      expect(result.error).toBeDefined();
      expect(result.duration).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should store execution result', async () => {
      const result = await adapter.execute('test command');
      const status = await adapter.getStatus(result.id);

      expect(status).toBe(ExecutionStatus.Failed);
    });

    it('should handle execution with options', async () => {
      const result = await adapter.execute('test command', {
        timeout: 3000,
        cwd: '/tmp',
        env: { TEST: 'value' },
      });

      expect(result.id).toBeDefined();
      expect(result.status).toBe(ExecutionStatus.Failed);
    });
  });

  describe('cancel', () => {
    it('should return false for non-existent execution', async () => {
      const cancelled = await adapter.cancel('non-existent-id');
      expect(cancelled).toBe(false);
    });

    it('should return false when execution is not running', async () => {
      const result = await adapter.execute('test command');
      const cancelled = await adapter.cancel(result.id);

      expect(cancelled).toBe(false);
    });

    it('should handle cancel operation', async () => {
      const cancelled = await adapter.cancel('some-id');
      expect(typeof cancelled).toBe('boolean');
    });
  });

  describe('getStatus', () => {
    it('should return undefined for non-existent execution', async () => {
      const status = await adapter.getStatus('non-existent-id');
      expect(status).toBeUndefined();
    });

    it('should return status of executed command', async () => {
      const result = await adapter.execute('test command');
      const status = await adapter.getStatus(result.id);

      expect(status).toBe(ExecutionStatus.Failed);
    });

    it('should return status for multiple executions', async () => {
      const result1 = await adapter.execute('command 1');
      const result2 = await adapter.execute('command 2');

      const status1 = await adapter.getStatus(result1.id);
      const status2 = await adapter.getStatus(result2.id);

      expect(status1).toBe(ExecutionStatus.Failed);
      expect(status2).toBe(ExecutionStatus.Failed);
    });
  });

  describe('retry logic', () => {
    it('should use default retry values', async () => {
      const defaultAdapter = new RemoteExecutionAdapter({
        endpoint: 'http://localhost:3000/execute',
      });

      const result = await defaultAdapter.execute('test command');
      expect(result.status).toBe(ExecutionStatus.Failed);
    });

    it('should respect custom retry configuration', async () => {
      const customAdapter = new RemoteExecutionAdapter({
        endpoint: 'http://localhost:3000/execute',
        retries: 5,
        retryDelay: 50,
      });

      const result = await customAdapter.execute('test command');
      expect(result.id).toBeDefined();
    });
  });
});
