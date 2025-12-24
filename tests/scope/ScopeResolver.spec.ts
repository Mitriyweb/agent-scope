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
  });
});
