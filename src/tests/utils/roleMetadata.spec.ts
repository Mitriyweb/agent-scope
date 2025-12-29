import { getRoleMetadata, isBuiltInRole, BUILT_IN_ROLES } from '@/utils/roleMetadata';
import { Role } from '@/enums/Role';

describe('roleMetadata', () => {
  describe('BUILT_IN_ROLES', () => {
    it('should contain all built-in roles', () => {
      expect(BUILT_IN_ROLES[Role.Developer]).toBeDefined();
      expect(BUILT_IN_ROLES[Role.Qa]).toBeDefined();
      expect(BUILT_IN_ROLES[Role.Architect]).toBeDefined();
      expect(BUILT_IN_ROLES[Role.Reviewer]).toBeDefined();
      expect(BUILT_IN_ROLES[Role.Spec]).toBeDefined();
    });

    it('should mark all roles as built-in', () => {
      Object.values(BUILT_IN_ROLES).forEach(metadata => {
        expect(metadata.isBuiltIn).toBe(true);
      });
    });
  });

  describe('getRoleMetadata', () => {
    it('should return metadata for DEVELOPER role', () => {
      const metadata = getRoleMetadata(Role.Developer);
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe(Role.Developer);
      expect(metadata?.isBuiltIn).toBe(true);
    });

    it('should return metadata for QA role', () => {
      const metadata = getRoleMetadata(Role.Qa);
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe(Role.Qa);
    });

    it('should return metadata for ARCHITECT role', () => {
      const metadata = getRoleMetadata(Role.Architect);
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe(Role.Architect);
    });

    it('should return metadata for REVIEWER role', () => {
      const metadata = getRoleMetadata(Role.Reviewer);
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe(Role.Reviewer);
    });

    it('should return metadata for SPEC role', () => {
      const metadata = getRoleMetadata(Role.Spec);
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe(Role.Spec);
    });

    it('should return undefined for unknown role', () => {
      const metadata = getRoleMetadata('unknown-role');
      expect(metadata).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const metadata = getRoleMetadata('');
      expect(metadata).toBeUndefined();
    });
  });

  describe('isBuiltInRole', () => {
    it('should return true for DEVELOPER role', () => {
      expect(isBuiltInRole(Role.Developer)).toBe(true);
    });

    it('should return true for QA role', () => {
      expect(isBuiltInRole(Role.Qa)).toBe(true);
    });

    it('should return true for ARCHITECT role', () => {
      expect(isBuiltInRole(Role.Architect)).toBe(true);
    });

    it('should return true for REVIEWER role', () => {
      expect(isBuiltInRole(Role.Reviewer)).toBe(true);
    });

    it('should return false for unknown role', () => {
      expect(isBuiltInRole('unknown-role')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isBuiltInRole('')).toBe(false);
    });
  });
});
