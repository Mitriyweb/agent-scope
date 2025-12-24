import { getRoleMetadata, isBuiltInRole, BUILT_IN_ROLES } from '@/utils/roleMetadata';
import { Role } from '@/enums/Role';

describe('roleMetadata', () => {
  describe('BUILT_IN_ROLES', () => {
    it('should contain all built-in roles', () => {
      expect(BUILT_IN_ROLES[Role.DEVELOPER]).toBeDefined();
      expect(BUILT_IN_ROLES[Role.QA]).toBeDefined();
      expect(BUILT_IN_ROLES[Role.ARCHITECT]).toBeDefined();
      expect(BUILT_IN_ROLES[Role.REVIEWER]).toBeDefined();
    });

    it('should mark all roles as built-in', () => {
      Object.values(BUILT_IN_ROLES).forEach(metadata => {
        expect(metadata.isBuiltIn).toBe(true);
      });
    });
  });

  describe('getRoleMetadata', () => {
    it('should return metadata for DEVELOPER role', () => {
      const metadata = getRoleMetadata(Role.DEVELOPER);
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe(Role.DEVELOPER);
      expect(metadata?.isBuiltIn).toBe(true);
    });

    it('should return metadata for QA role', () => {
      const metadata = getRoleMetadata(Role.QA);
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe(Role.QA);
    });

    it('should return metadata for ARCHITECT role', () => {
      const metadata = getRoleMetadata(Role.ARCHITECT);
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe(Role.ARCHITECT);
    });

    it('should return metadata for REVIEWER role', () => {
      const metadata = getRoleMetadata(Role.REVIEWER);
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe(Role.REVIEWER);
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
      expect(isBuiltInRole(Role.DEVELOPER)).toBe(true);
    });

    it('should return true for QA role', () => {
      expect(isBuiltInRole(Role.QA)).toBe(true);
    });

    it('should return true for ARCHITECT role', () => {
      expect(isBuiltInRole(Role.ARCHITECT)).toBe(true);
    });

    it('should return true for REVIEWER role', () => {
      expect(isBuiltInRole(Role.REVIEWER)).toBe(true);
    });

    it('should return false for unknown role', () => {
      expect(isBuiltInRole('unknown-role')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isBuiltInRole('')).toBe(false);
    });
  });
});
