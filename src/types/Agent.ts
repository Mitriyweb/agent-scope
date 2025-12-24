import type { Role } from '@/enums/Role';
import type { Scope } from '@/types/Scope';

export interface Agent {
  name: string;
  role: Role;
  scope: Scope;
}
