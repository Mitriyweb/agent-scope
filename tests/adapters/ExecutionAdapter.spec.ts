import type { ExecutionResult, ExecutionOptions } from '@/adapters/ExecutionAdapter';
import ExecutionStatus from '@/types/ExecutionStatus';

describe('ExecutionAdapter Interface', () => {
  it('should define ExecutionResult interface', () => {
    const result: ExecutionResult = {
      id: 'test-id',
      status: ExecutionStatus.Success,
      output: 'test output',
      duration: 100,
      timestamp: new Date(),
      exitCode: 0,
    };

    expect(result.id).toBe('test-id');
    expect(result.status).toBe(ExecutionStatus.Success);
    expect(result.output).toBe('test output');
    expect(result.duration).toBe(100);
    expect(result.exitCode).toBe(0);
  });

  it('should define ExecutionOptions interface', () => {
    const options: ExecutionOptions = {
      timeout: 5000,
      cwd: '/tmp',
      env: { TEST: 'value' },
    };

    expect(options.timeout).toBe(5000);
    expect(options.cwd).toBe('/tmp');
    expect(options.env?.TEST).toBe('value');
  });

  it('should allow ExecutionResult with optional fields', () => {
    const result: ExecutionResult = {
      id: 'test-id',
      status: ExecutionStatus.Failed,
      output: '',
      duration: 50,
      timestamp: new Date(),
    };

    expect(result.error).toBeUndefined();
    expect(result.exitCode).toBeUndefined();
  });

  it('should allow ExecutionResult with error message', () => {
    const result: ExecutionResult = {
      id: 'test-id',
      status: ExecutionStatus.Failed,
      output: '',
      error: 'Command failed',
      duration: 50,
      timestamp: new Date(),
      exitCode: 1,
    };

    expect(result.error).toBe('Command failed');
    expect(result.exitCode).toBe(1);
  });
});
