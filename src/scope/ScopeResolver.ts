import type { Scope } from '@/types/Scope';
import { minimatch } from 'minimatch';

export class ScopeResolver {
  static canAccess(filePath: string, scope: Scope): boolean {
    return scope.patterns.some(pattern => minimatch(filePath, pattern));
  }

  static canModify(filePath: string, scope: Scope): boolean {
    if (scope.readOnly) {
      return false;
    }
    return ScopeResolver.canAccess(filePath, scope);
  }

  static getMostSpecificPattern(filePath: string, patterns: string[]): string | undefined {
    const matchingPatterns = patterns.filter(pattern => minimatch(filePath, pattern));

    if (matchingPatterns.length === 0) {
      return undefined;
    }

    return matchingPatterns.reduce((most, current) => {
      const currentSpecificity = current.split('/').length;
      const mostSpecificity = most.split('/').length;
      return currentSpecificity > mostSpecificity ? current : most;
    });
  }
}
