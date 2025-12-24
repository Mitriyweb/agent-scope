import type { Role } from '@/enums/Role';

export interface RoleMetadata {
  name: Role | string;
  description: string;
  isBuiltIn: boolean;
}
