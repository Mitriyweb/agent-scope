import { RoleRegistry } from '@/roles/RoleRegistry';
import { Role } from '@/enums/Role';

describe('RoleRegistry', () => {
  it('should list all built-in roles', () => {
    const registry = new RoleRegistry();
    const roles = registry.listRoles();

    expect(roles).toHaveLength(4);
    expect(roles.map(r => r.name)).toContain(Role.DEVELOPER);
    expect(roles.map(r => r.name)).toContain(Role.QA);
    expect(roles.map(r => r.name)).toContain(Role.ARCHITECT);
    expect(roles.map(r => r.name)).toContain(Role.REVIEWER);
  });

  it('should get built-in role metadata', () => {
    const registry = new RoleRegistry();
    const role = registry.getRole(Role.DEVELOPER);

    expect(role).toBeDefined();
    expect(role?.name).toBe(Role.DEVELOPER);
    expect(role?.isBuiltIn).toBe(true);
    expect(role?.description).toBeDefined();
  });

  it('should add custom role', () => {
    const registry = new RoleRegistry();
    registry.addCustomRole('custom-role', 'A custom role');

    expect(registry.hasRole('custom-role')).toBe(true);
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
    expect(registry.hasRole('custom-role')).toBe(false);
  });

  it('should prevent removing built-in roles', () => {
    const registry = new RoleRegistry();

    expect(() => registry.removeCustomRole(Role.DEVELOPER)).toThrow();
  });

  it('should identify built-in roles', () => {
    const registry = new RoleRegistry();

    expect(registry.isBuiltInRole(Role.DEVELOPER)).toBe(true);
    expect(registry.isBuiltInRole('custom-role')).toBe(false);
  });

  it('should reject empty role names', () => {
    const registry = new RoleRegistry();

    expect(() => registry.addCustomRole('', 'Empty name')).toThrow();
  });
});
