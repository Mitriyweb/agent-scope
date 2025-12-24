import { ErrorFormatter } from '@/utils/ErrorFormatter';

describe('ErrorFormatter', () => {
  it('should format basic error', () => {
    const error = { type: 'test', message: 'Test error' };
    const formatted = ErrorFormatter.format(error);

    expect(formatted).toContain('Error: Test error');
  });

  it('should include context when provided', () => {
    const error = { type: 'test', message: 'Test error', context: 'Node A' };
    const formatted = ErrorFormatter.format(error);

    expect(formatted).toContain('Context: Node A');
  });

  it('should include suggestion when provided', () => {
    const error = { type: 'test', message: 'Test error', suggestion: 'Fix it' };
    const formatted = ErrorFormatter.format(error);

    expect(formatted).toContain('Suggestion: Fix it');
  });

  it('should include example when provided', () => {
    const error = { type: 'test', message: 'Test error', example: 'Example code' };
    const formatted = ErrorFormatter.format(error);

    expect(formatted).toContain('Example:\nExample code');
  });

  it('should suppress details in quiet mode', () => {
    const error = { type: 'test', message: 'Test error', suggestion: 'Fix it' };
    const formatted = ErrorFormatter.format(error, true);

    expect(formatted).not.toContain('Suggestion');
  });

  it('should create validation error', () => {
    const error = ErrorFormatter.validationError('node1', 'Missing input');

    expect(error.type).toBe('validation');
    expect(error.message).toContain('validation failed');
  });

  it('should create file not found error', () => {
    const error = ErrorFormatter.fileNotFound('/path/to/file.json');

    expect(error.type).toBe('file_not_found');
    expect(error.message).toContain('File not found');
  });

  it('should create invalid JSON error', () => {
    const error = ErrorFormatter.invalidJson('/path/to/file.json');

    expect(error.type).toBe('invalid_json');
    expect(error.message).toContain('Invalid JSON');
  });
});
