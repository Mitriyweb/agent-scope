import { ScopeResolver } from '@/scope/ScopeResolver';
import type { Scope } from '@/types/Scope';

describe('ScopeResolver', () => {
  const readWriteScope: Scope = {
    patterns: ['src/**', 'tests/**'],
    readOnly: false,
  };

  const readOnlyScope: Scope = {
    patterns: ['docs/**'],
    readOnly: true,
  };

  describe('canAccess', () => {
    it('should allow access to files matching scope patterns', () => {
      expect(ScopeResolver.canAccess('src/index.ts', readWriteScope)).toBe(true);
      expect(ScopeResolver.canAccess('tests/index.spec.ts', readWriteScope)).toBe(true);
    });

    it('should deny access to files outside scope', () => {
      expect(ScopeResolver.canAccess('docs/README.md', readWriteScope)).toBe(false);
    });

    it('should support wildcard patterns', () => {
      const scope: Scope = {
        patterns: ['src/**/*.ts'],
        readOnly: false,
      };

      expect(ScopeResolver.canAccess('src/index.ts', scope)).toBe(true);
      expect(ScopeResolver.canAccess('src/utils/helper.ts', scope)).toBe(true);
      expect(ScopeResolver.canAccess('src/config.json', scope)).toBe(false);
    });
  });

  describe('canModify', () => {
    it('should allow modification in read-write scope', () => {
      expect(ScopeResolver.canModify('src/index.ts', readWriteScope)).toBe(true);
    });

    it('should deny modification in read-only scope', () => {
      expect(ScopeResolver.canModify('docs/README.md', readOnlyScope)).toBe(false);
    });

    it('should deny modification outside scope', () => {
      expect(ScopeResolver.canModify('docs/README.md', readWriteScope)).toBe(false);
    });
  });

  describe('getMostSpecificPattern', () => {
    it('should return most specific matching pattern', () => {
      const patterns = ['src/**', 'src/utils/**', 'src/utils/helpers/**'];
      const result = ScopeResolver.getMostSpecificPattern('src/utils/helpers/index.ts', patterns);

      expect(result).toBe('src/utils/helpers/**');
    });

    it('should return undefined for non-matching file', () => {
      const patterns = ['src/**', 'tests/**'];
      const result = ScopeResolver.getMostSpecificPattern('docs/README.md', patterns);

      expect(result).toBeUndefined();
    });

    it('should handle single matching pattern', () => {
      const patterns = ['src/**'];
      const result = ScopeResolver.getMostSpecificPattern('src/index.ts', patterns);

      expect(result).toBe('src/**');
    });

    it('should handle complex nested patterns', () => {
      const patterns = ['src/**', 'src/commands/**', 'src/commands/agent/**'];
      const result = ScopeResolver.getMostSpecificPattern('src/commands/agent/index.ts', patterns);

      expect(result).toBe('src/commands/agent/**');
    });

    it('should return undefined when no patterns match', () => {
      const patterns = ['tests/**', 'docs/**'];
      const result = ScopeResolver.getMostSpecificPattern('src/index.ts', patterns);

      expect(result).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty pattern array', () => {
      expect(ScopeResolver.canAccess('src/index.ts', { patterns: [], readOnly: false })).toBe(
        false
      );
    });

    it('should handle files at root level', () => {
      const scope: Scope = { patterns: ['*.ts'], readOnly: false };
      expect(ScopeResolver.canAccess('index.ts', scope)).toBe(true);
      expect(ScopeResolver.canAccess('src/index.ts', scope)).toBe(false);
    });

    it('should handle deeply nested paths', () => {
      const scope: Scope = { patterns: ['src/**'], readOnly: false };
      expect(ScopeResolver.canAccess('src/a/b/c/d/e/f/index.ts', scope)).toBe(true);
    });

    it('should handle multiple patterns with different specificity', () => {
      const scope: Scope = { patterns: ['src/**', 'tests/**', 'lib/**'], readOnly: false };
      expect(ScopeResolver.canAccess('src/index.ts', scope)).toBe(true);
      expect(ScopeResolver.canAccess('tests/index.spec.ts', scope)).toBe(true);
      expect(ScopeResolver.canAccess('lib/helper.ts', scope)).toBe(true);
      expect(ScopeResolver.canAccess('docs/README.md', scope)).toBe(false);
    });

    it('should handle canModify with multiple patterns', () => {
      const scope: Scope = { patterns: ['src/**', 'tests/**'], readOnly: false };
      expect(ScopeResolver.canModify('src/index.ts', scope)).toBe(true);
      expect(ScopeResolver.canModify('tests/index.spec.ts', scope)).toBe(true);
      expect(ScopeResolver.canModify('docs/README.md', scope)).toBe(false);
    });

    it('should handle getMostSpecificPattern with overlapping patterns', () => {
      const patterns = [
        'src/**',
        'src/commands/**',
        'src/commands/agent/**',
        'src/commands/agent/index/**',
      ];
      const result = ScopeResolver.getMostSpecificPattern(
        'src/commands/agent/index/test.ts',
        patterns
      );
      expect(result).toBe('src/commands/agent/index/**');
    });
  });
});
