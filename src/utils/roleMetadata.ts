import { Role } from '@/enums/Role';
import type { RoleMetadata } from '@/types/RoleMetadata';

export const BUILT_IN_ROLES: Record<Role, RoleMetadata> = {
  [Role.DEVELOPER]: {
    name: Role.DEVELOPER,
    description: 'Can read/write code, run tests',
    isBuiltIn: true,
  },
  [Role.QA]: {
    name: Role.QA,
    description: 'Can read code, run tests, report issues',
    isBuiltIn: true,
  },
  [Role.ARCHITECT]: {
    name: Role.ARCHITECT,
    description: 'Can read all, design decisions, review PRs',
    isBuiltIn: true,
  },
  [Role.REVIEWER]: {
    name: Role.REVIEWER,
    description: 'Can read code, approve changes',
    isBuiltIn: true,
  },
};

export function getRoleMetadata(role: Role | string): RoleMetadata | undefined {
  if (role in BUILT_IN_ROLES) {
    return BUILT_IN_ROLES[role as Role];
  }
  return undefined;
}

export function isBuiltInRole(role: Role | string): boolean {
  return role in BUILT_IN_ROLES;
}
