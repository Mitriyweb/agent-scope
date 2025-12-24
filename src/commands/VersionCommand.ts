import type { CommandHandler } from '@/types/index';
import { getVersion } from '@/utils/version';

export class VersionCommand implements CommandHandler {
  execute(): void {
    const version = getVersion();
    console.log(`agent-scope v${version}`);
  }
}
