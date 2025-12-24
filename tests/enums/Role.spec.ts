import { Role } from '@/enums/Role';

describe('Role enum', () => {
  it('should have all built-in roles', () => {
    expect(Role.DEVELOPER).toBe('developer');
    expect(Role.QA).toBe('qa');
    expect(Role.ARCHITECT).toBe('architect');
    expect(Role.REVIEWER).toBe('reviewer');
  });

  it('should have exactly 4 built-in roles', () => {
    const roles = Object.values(Role);
    expect(roles).toHaveLength(4);
  });
});
