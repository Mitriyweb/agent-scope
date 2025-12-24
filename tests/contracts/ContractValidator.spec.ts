import { ContractValidator } from '@/contracts/ContractValidator';
import type { Specification } from '@/specs/Specification';

describe('ContractValidator', () => {
  let validator: ContractValidator;

  beforeEach(() => {
    validator = new ContractValidator();
  });

  const createSpec = (
    name: string,
    inputs: string[] = [],
    outputs: string[] = []
  ): Specification => ({
    name,
    version: '1.0.0',
    inputs: inputs.map(n => ({ name: n })),
    outputs: outputs.map(n => ({ name: n })),
  });

  it('should validate matching producer-consumer contract', () => {
    const producer = createSpec('producer', [], ['data']);
    const consumer = createSpec('consumer', ['data'], []);

    const violations = validator.validateContract(producer, consumer);
    expect(violations).toHaveLength(0);
  });

  it('should detect missing producer output', () => {
    const producer = createSpec('producer', [], ['data1']);
    const consumer = createSpec('consumer', ['data1', 'data2'], []);

    const violations = validator.validateContract(producer, consumer);
    expect(violations).toHaveLength(1);
    expect(violations[0].type).toBe('missing-output');
    expect(violations[0].message).toContain('data2');
  });

  it('should detect unused producer output', () => {
    const producer = createSpec('producer', [], ['data1', 'data2']);
    const consumer = createSpec('consumer', ['data1'], []);

    const violations = validator.validateContract(producer, consumer);
    expect(violations).toHaveLength(1);
    expect(violations[0].type).toBe('missing-input');
    expect(violations[0].message).toContain('data2');
  });

  it('should handle empty specifications', () => {
    const producer = createSpec('producer');
    const consumer = createSpec('consumer');

    const violations = validator.validateContract(producer, consumer);
    expect(violations).toHaveLength(0);
  });

  it('should validate contract object', () => {
    const producer = createSpec('producer', [], ['data']);
    const consumer = createSpec('consumer', ['data'], []);
    const contract = {
      producerName: 'producer',
      consumerName: 'consumer',
      producerSpec: producer,
      consumerSpec: consumer,
    };

    const violations = validator.checkContract(contract);
    expect(violations).toHaveLength(0);
  });
});
