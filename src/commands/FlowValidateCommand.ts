import { FlowParser } from '@/flows/FlowParser';
import { FlowValidator } from '@/flows/FlowValidator';

export class FlowValidateCommand {
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('Usage: agent-scope flow validate <flow-file>');
      return;
    }

    const filePath = args[0];

    try {
      const fs = await import('fs');
      const content = fs.readFileSync(filePath, 'utf-8');
      const flow = FlowParser.parseJSON(content);
      const errors = FlowValidator.validate(flow);

      if (errors.length === 0) {
        console.log(`✅ Flow "${flow.name}" is valid`);
      } else {
        console.log(`❌ Flow "${flow.name}" has ${errors.length} error(s):`);
        for (const error of errors) {
          console.log(`  - ${error.message}`);
        }
      }
    } catch (error) {
      console.error(
        `Error validating flow: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
