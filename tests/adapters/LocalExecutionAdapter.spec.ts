import { LocalExecutionAdapter } from '@/adapters/LocalExecutionAdapter';
import ExecutionStatus from '@/types/ExecutionStatus';

describe('LocalExecutionAdapter', () => {
  let adapter: LocalExecutionAdapter;

  beforeEach(() => {
    adapter = new LocalExecutionAdapter();
  });

  describe('name property', () => {
    it('should have name "local"', () => {
      expect(adapter.name).toBe('local');
    });
  });

  describe('execute', () => {
    it('should execute a successful command', async () => {
      const result = await adapter.execute('echo "test"');

      expect(result.id).toBeDefined();
      expect(result.status).toBe(ExecutionStatus.Success);
      expect(result.output).toContain('test');
      expect(result.duration).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.exitCode).toBe(0);
    });

    it('should handle command execution with options', async () => {
      const result = await adapter.execute('echo "test"', {
        timeout: 5000,
      });

      expect(result.status).toBe(ExecutionStatus.Success);
      expect(result.output).toContain('test');
    });

    it('should handle failed command execution', async () => {
      const result = await adapter.execute('exit 1');

      expect(result.status).toBe(ExecutionStatus.Failed);
      expect(result.exitCode).toBe(1);
      expect(result.error).toBeDefined();
    });

    it('should handle invalid command', async () => {
      const result = await adapter.execute('nonexistent-command-xyz');

      expect(result.status).toBe(ExecutionStatus.Failed);
      expect(result.error).toBeDefined();
    });

    it('should store execution result', async () => {
      const result = await adapter.execute('echo "test"');

      const status = await adapter.getStatus(result.id);
      expect(status).toBe(ExecutionStatus.Success);
    });
  });

  describe('cancel', () => {
    it('should return false for non-existent execution', async () => {
      const cancelled = await adapter.cancel('non-existent-id');
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
      const result = await adapter.execute('echo "test"');
      const status = await adapter.getStatus(result.id);

      expect(status).toBe(ExecutionStatus.Success);
    });

    it('should return status of failed command', async () => {
      const result = await adapter.execute('exit 1');
      const status = await adapter.getStatus(result.id);

      expect(status).toBe(ExecutionStatus.Failed);
    });
  });
});
