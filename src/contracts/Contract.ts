import type { Specification } from '@/specs/Specification';

export interface Contract {
  producerName: string;
  consumerName: string;
  producerSpec: Specification;
  consumerSpec: Specification;
}

export interface ContractViolation {
  type: 'missing-output' | 'missing-input' | 'type-mismatch';
  message: string;
  producer: string;
  consumer: string;
  detail?: string;
}
