import type { RoleMetadata } from '@/types/RoleMetadata';
import { Role } from '@/enums/Role';
import { BUILT_IN_ROLES } from '@/utils/roleMetadata';

export class RoleRegistry {
  private customRoles: Map<string, RoleMetadata> = new Map();

  addCustomRole(name: string, description: string): void {
    if (name in BUILT_IN_ROLES) {
      throw new Error(`Cannot override built-in role "${name}"`);
    }

    if (!name.trim()) {
      throw new Error('Role name cannot be empty');
    }

    this.customRoles.set(name, {
      name,
      description,
      isBuiltIn: false,
    });
  }

  removeCustomRole(name: string): boolean {
    if (name in BUILT_IN_ROLES) {
      throw new Error(`Cannot delete built-in role "${name}"`);
    }
    return this.customRoles.delete(name);
  }

  getRole(name: string): RoleMetadata | undefined {
    if (name in BUILT_IN_ROLES) {
      return BUILT_IN_ROLES[name as Role];
    }
    return this.customRoles.get(name);
  }

  listRoles(): RoleMetadata[] {
    const builtIn = Object.values(BUILT_IN_ROLES);
    const custom = Array.from(this.customRoles.values());
    return [...builtIn, ...custom];
  }

  hasRole(name: string): boolean {
    return name in BUILT_IN_ROLES || this.customRoles.has(name);
  }

  isBuiltInRole(name: string): boolean {
    return name in BUILT_IN_ROLES;
  }
}
