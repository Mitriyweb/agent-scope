import type { Agent } from '@/types/Agent';
import { Role } from '@/enums/Role';
import { isBuiltInRole } from '@/utils/roleMetadata';

export class AgentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AgentValidationError';
  }
}

export function validateAgent(agent: unknown): asserts agent is Agent {
  if (!agent || typeof agent !== 'object') {
    throw new AgentValidationError('Agent must be an object');
  }

  const a = agent as Record<string, unknown>;

  if (!a.name || typeof a.name !== 'string') {
    throw new AgentValidationError('Agent name is required and must be a string');
  }

  if (!a.name.trim()) {
    throw new AgentValidationError('Agent name cannot be empty');
  }

  if (!a.role || typeof a.role !== 'string') {
    throw new AgentValidationError('Agent role is required and must be a string');
  }

  const validRoles = Object.values(Role);
  if (!validRoles.includes(a.role as Role) && !isBuiltInRole(a.role)) {
    throw new AgentValidationError(
      `Invalid agent role "${a.role}". Valid roles are: ${validRoles.join(', ')}`
    );
  }

  if (!a.scope || typeof a.scope !== 'object') {
    throw new AgentValidationError('Agent scope is required and must be an object');
  }

  const scope = a.scope as Record<string, unknown>;

  if (!Array.isArray(scope.patterns)) {
    throw new AgentValidationError('Scope patterns must be an array');
  }

  if (scope.patterns.length === 0) {
    throw new AgentValidationError('Scope patterns cannot be empty');
  }

  if (!scope.patterns.every(p => typeof p === 'string')) {
    throw new AgentValidationError('All scope patterns must be strings');
  }

  if (typeof scope.readOnly !== 'boolean') {
    throw new AgentValidationError('Scope readOnly must be a boolean');
  }
}
