import type { Command } from '@/types/Command';
import { ContractValidator } from '@/contracts/ContractValidator';
import { validateSpecification } from '@/specs/validateSpecification';
import fs from 'fs/promises';
import path from 'path';

export class ContractCheckCommand implements Command {
  name = 'contract check';
  description = 'Check contract between producer and consumer';

  async execute(options: Record<string, unknown>): Promise<void> {
    const producerFile = options.producer as string | undefined;
    const consumerFile = options.consumer as string | undefined;

    if (!producerFile || !consumerFile) {
      throw new Error('--producer and --consumer are required');
    }

    const producerPath = path.resolve(producerFile);
    const consumerPath = path.resolve(consumerFile);

    const producerContent = await fs.readFile(producerPath, 'utf-8');
    const consumerContent = await fs.readFile(consumerPath, 'utf-8');

    const producerSpec = JSON.parse(producerContent);
    const consumerSpec = JSON.parse(consumerContent);

    validateSpecification(producerSpec);
    validateSpecification(consumerSpec);

    const validator = new ContractValidator();
    const violations = validator.validateContract(producerSpec, consumerSpec);

    if (violations.length === 0) {
      console.log(`✓ Contract valid between ${producerSpec.name} and ${consumerSpec.name}`);
    } else {
      console.log(`✗ Contract violations found:`);
      for (const violation of violations) {
        console.log(`  - ${violation.message}`);
        if (violation.detail) {
          console.log(`    ${violation.detail}`);
        }
      }
      throw new Error(`Contract check failed with ${violations.length} violation(s)`);
    }
  }
}
