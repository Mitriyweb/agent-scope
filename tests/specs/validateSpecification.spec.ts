import { validateSpecification, SpecificationValidationError } from '@/specs/validateSpecification';
import type { Specification } from '@/specs/Specification';

describe('validateSpecification', () => {
  const createTestSpec = (name: string = 'test-spec'): Specification => ({
    name,
    version: '1.0.0',
    inputs: [{ name: 'input1', description: 'Test input' }],
    outputs: [{ name: 'output1', description: 'Test output' }],
  });

  it('should validate a correct specification', () => {
    const spec = createTestSpec();
    expect(() => validateSpecification(spec)).not.toThrow();
  });

  it('should reject specification without name', () => {
    const spec = { version: '1.0.0' };
    expect(() => validateSpecification(spec)).toThrow(SpecificationValidationError);
  });

  it('should reject specification without version', () => {
    const spec = { name: 'test-spec' };
    expect(() => validateSpecification(spec)).toThrow(SpecificationValidationError);
  });

  it('should reject empty name', () => {
    const spec = { name: '', version: '1.0.0' };
    expect(() => validateSpecification(spec)).toThrow(SpecificationValidationError);
  });

  it('should accept specification with inputs array', () => {
    const spec = createTestSpec();
    expect(() => validateSpecification(spec)).not.toThrow();
  });

  it('should accept specification with outputs array', () => {
    const spec = createTestSpec();
    expect(() => validateSpecification(spec)).not.toThrow();
  });

  it('should reject invalid inputs type', () => {
    const spec = { name: 'test', version: '1.0.0', inputs: 'invalid' };
    expect(() => validateSpecification(spec)).toThrow(SpecificationValidationError);
  });

  it('should reject invalid outputs type', () => {
    const spec = { name: 'test', version: '1.0.0', outputs: 'invalid' };
    expect(() => validateSpecification(spec)).toThrow(SpecificationValidationError);
  });
});
