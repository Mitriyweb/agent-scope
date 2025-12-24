import type { Specification } from '@/specs/Specification';
import type { Contract, ContractViolation } from '@/contracts/Contract';

export class ContractValidator {
  validateContract(producerSpec: Specification, consumerSpec: Specification): ContractViolation[] {
    const violations: ContractViolation[] = [];

    // Check if consumer inputs are satisfied by producer outputs
    if (consumerSpec.inputs && consumerSpec.inputs.length > 0) {
      for (const input of consumerSpec.inputs) {
        const producerOutput = producerSpec.outputs?.find(o => o.name === input.name);

        if (!producerOutput) {
          violations.push({
            type: 'missing-output',
            message: `Producer does not provide required output: ${input.name}`,
            producer: producerSpec.name,
            consumer: consumerSpec.name,
            detail: `Consumer requires input "${input.name}" but producer does not provide it`,
          });
        }
      }
    }

    // Check if producer outputs are consumed by consumer
    if (producerSpec.outputs && producerSpec.outputs.length > 0) {
      for (const output of producerSpec.outputs) {
        const consumerInput = consumerSpec.inputs?.find(i => i.name === output.name);

        if (!consumerInput) {
          violations.push({
            type: 'missing-input',
            message: `Consumer does not accept producer output: ${output.name}`,
            producer: producerSpec.name,
            consumer: consumerSpec.name,
            detail: `Producer provides output "${output.name}" but consumer does not accept it`,
          });
        }
      }
    }

    return violations;
  }

  checkContract(contract: Contract): ContractViolation[] {
    return this.validateContract(contract.producerSpec, contract.consumerSpec);
  }
}
