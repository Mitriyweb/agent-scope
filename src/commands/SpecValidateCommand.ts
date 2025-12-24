import type { Command } from '@/types/Command';
import { validateSpecification, SpecificationValidationError } from '@/specs/validateSpecification';
import fs from 'fs/promises';
import path from 'path';

export class SpecValidateCommand implements Command {
  name = 'spec validate';
  description = 'Validate a specification file';

  async execute(options: Record<string, unknown>): Promise<void> {
    const specFile = options.file as string | undefined;

    if (!specFile) {
      throw new Error('--file is required');
    }

    const specPath = path.resolve(specFile);
    const content = await fs.readFile(specPath, 'utf-8');
    const spec = JSON.parse(content);

    try {
      validateSpecification(spec);
      console.log(`✓ Specification valid: ${spec.name} v${spec.version}`);
    } catch (error) {
      if (error instanceof SpecificationValidationError) {
        throw new Error(`Specification validation failed: ${error.message}`);
      }
      throw error;
    }
  }
}
