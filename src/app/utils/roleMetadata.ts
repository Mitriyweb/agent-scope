import { Role } from '@/enums/Role';
import type { RoleMetadata } from '@/types/RoleMetadata';

export const BUILT_IN_ROLES: Record<Role, RoleMetadata> = {
  [Role.Developer]: {
    name: Role.Developer,
    description: 'Can read/write code, run tests',
    isBuiltIn: true,
  },
  [Role.Qa]: {
    name: Role.Qa,
    description: 'Can read code, run tests, report issues',
    isBuiltIn: true,
  },
  [Role.Architect]: {
    name: Role.Architect,
    description: 'Can read all, design decisions, review PRs',
    isBuiltIn: true,
  },
  [Role.Reviewer]: {
    name: Role.Reviewer,
    description: 'Can read code, approve changes',
    isBuiltIn: true,
  },
  [Role.Spec]: {
    name: Role.Spec,
    description: 'Can write specifications',
    isBuiltIn: true,
  },
  [Role.Unknown]: {
    name: Role.Unknown,
    description: 'Fallback for undefined roles',
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
