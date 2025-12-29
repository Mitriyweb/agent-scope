import type { Agent } from '@/types/Agent';
import { Role } from '@/enums/Role';

describe('Agent type', () => {
  it('should create a valid agent', () => {
    const agent: Agent = {
      name: 'backend-dev',
      role: Role.Developer,
      scope: {
        patterns: ['src/backend/**'],
        readOnly: false,
      },
    };

    expect(agent.name).toBe('backend-dev');
    expect(agent.role).toBe(Role.Developer);
    expect(agent.scope.patterns).toEqual(['src/backend/**']);
    expect(agent.scope.readOnly).toBe(false);
  });

  it('should support read-only scope', () => {
    const agent: Agent = {
      name: 'qa-agent',
      role: Role.Qa,
      scope: {
        patterns: ['src/**'],
        readOnly: true,
      },
    };

    expect(agent.scope.readOnly).toBe(true);
  });
});
