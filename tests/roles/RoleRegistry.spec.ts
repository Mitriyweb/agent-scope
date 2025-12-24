import { RoleRegistry } from '@/roles/RoleRegistry';
import { Role } from '@/enums/Role';

describe('RoleRegistry', () => {
  it('should list all built-in roles', () => {
    const registry = new RoleRegistry();
    const roles = registry.listRoles();
    expect(roles).toHaveLength(4);
  });

  it('should include DEVELOPER role in list', () => {
    const registry = new RoleRegistry();
    const roles = registry.listRoles();
    expect(roles.map(r => r.name)).toContain(Role.DEVELOPER);
  });

  it('should include QA role in list', () => {
    const registry = new RoleRegistry();
    const roles = registry.listRoles();
    expect(roles.map(r => r.name)).toContain(Role.QA);
  });

  it('should include ARCHITECT role in list', () => {
    const registry = new RoleRegistry();
    const roles = registry.listRoles();
    expect(roles.map(r => r.name)).toContain(Role.ARCHITECT);
  });

  it('should include REVIEWER role in list', () => {
    const registry = new RoleRegistry();
    const roles = registry.listRoles();
    expect(roles.map(r => r.name)).toContain(Role.REVIEWER);
  });

  it('should get built-in role metadata', () => {
    const registry = new RoleRegistry();
    const role = registry.getRole(Role.DEVELOPER);
    expect(role).toBeDefined();
  });

  it('should return correct role name', () => {
    const registry = new RoleRegistry();
    const role = registry.getRole(Role.DEVELOPER);
    expect(role?.name).toBe(Role.DEVELOPER);
  });

  it('should mark built-in role as isBuiltIn', () => {
    const registry = new RoleRegistry();
    const role = registry.getRole(Role.DEVELOPER);
    expect(role?.isBuiltIn).toBe(true);
  });

  it('should include description for built-in role', () => {
    const registry = new RoleRegistry();
    const role = registry.getRole(Role.DEVELOPER);
    expect(role?.description).toBeDefined();
  });

  it('should add custom role', () => {
    const registry = new RoleRegistry();
    registry.addCustomRole('custom-role', 'A custom role');
    expect(registry.hasRole('custom-role')).toBe(true);
  });

  it('should mark custom role as not built-in', () => {
    const registry = new RoleRegistry();
    registry.addCustomRole('custom-role', 'A custom role');
    const role = registry.getRole('custom-role');
    expect(role?.isBuiltIn).toBe(false);
  });

  it('should prevent overriding built-in roles', () => {
    const registry = new RoleRegistry();

    expect(() => registry.addCustomRole(Role.DEVELOPER, 'Override')).toThrow();
  });

  it('should remove custom role', () => {
    const registry = new RoleRegistry();
    registry.addCustomRole('custom-role', 'A custom role');
    expect(registry.removeCustomRole('custom-role')).toBe(true);
  });

  it('should not have role after removal', () => {
    const registry = new RoleRegistry();
    registry.addCustomRole('custom-role', 'A custom role');
    registry.removeCustomRole('custom-role');
    expect(registry.hasRole('custom-role')).toBe(false);
  });

  it('should prevent removing built-in roles', () => {
    const registry = new RoleRegistry();

    expect(() => registry.removeCustomRole(Role.DEVELOPER)).toThrow();
  });

  it('should identify built-in roles', () => {
    const registry = new RoleRegistry();
    expect(registry.isBuiltInRole(Role.DEVELOPER)).toBe(true);
  });

  it('should identify custom roles as not built-in', () => {
    const registry = new RoleRegistry();
    expect(registry.isBuiltInRole('custom-role')).toBe(false);
  });

  it('should reject empty role names', () => {
    const registry = new RoleRegistry();

    expect(() => registry.addCustomRole('', 'Empty name')).toThrow();
  });
});
