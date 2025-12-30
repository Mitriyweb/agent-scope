import { execSync } from 'child_process';
import type { OpenSpecDetectionResult } from '@/types/AgentScope';

/**
 * Detects OpenSpec CLI availability and version
 */
export class OpenSpecDetector {
  /**
   * Check if OpenSpec CLI is installed
   */
  isInstalled(): boolean {
    try {
      execSync('which openspec', { stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get OpenSpec CLI version
   */
  getVersion(): string | null {
    try {
      const output = execSync('openspec --version', { encoding: 'utf-8', stdio: 'pipe' });
      return output.trim();
    } catch {
      return null;
    }
  }

  /**
   * Get warning message for missing OpenSpec
   */
  getWarningMessage(): string {
    return `
⚠️  Warning: openspec CLI not found

   Some workflows (sdd-cycle, implement-feature) require openspec.
   
   Install openspec:
   npm install -g openspec
   
   You can still use agent-scope, but openspec-dependent workflows
   will not work until openspec is installed.
`;
  }

  /**
   * Detect OpenSpec and return full result
   */
  detect(): OpenSpecDetectionResult {
    const installed = this.isInstalled();
    const version = installed ? this.getVersion() : null;
    const warningMessage = installed ? null : this.getWarningMessage();

    return {
      installed,
      version,
      warningMessage,
    };
  }
}
