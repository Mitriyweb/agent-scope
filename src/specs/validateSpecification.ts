import type { Specification } from '@/specs/Specification';

export class SpecificationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SpecificationValidationError';
  }
}

export function validateSpecification(spec: unknown): asserts spec is Specification {
  if (!spec || typeof spec !== 'object') {
    throw new SpecificationValidationError('Specification must be an object');
  }

  const s = spec as Record<string, unknown>;

  if (!s.name || typeof s.name !== 'string') {
    throw new SpecificationValidationError('Specification name is required and must be a string');
  }

  if (!s.name.trim()) {
    throw new SpecificationValidationError('Specification name cannot be empty');
  }

  if (!s.version || typeof s.version !== 'string') {
    throw new SpecificationValidationError(
      'Specification version is required and must be a string'
    );
  }

  if (s.inputs && !Array.isArray(s.inputs)) {
    throw new SpecificationValidationError('Specification inputs must be an array');
  }

  if (s.outputs && !Array.isArray(s.outputs)) {
    throw new SpecificationValidationError('Specification outputs must be an array');
  }

  if (s.description && typeof s.description !== 'string') {
    throw new SpecificationValidationError('Specification description must be a string');
  }
}
