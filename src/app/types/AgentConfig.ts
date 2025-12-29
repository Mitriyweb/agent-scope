import { Role } from '@/enums/Role';

export interface AgentConfig {
  name: string;
  role: Role;
  description: string;
  scope: string[];
  model?: string;
  instructions?: string;
}
