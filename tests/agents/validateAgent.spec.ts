import { validateAgent, AgentValidationError } from '@/agents/validateAgent';
import { Role } from '@/enums/Role';
import type { Agent } from '@/types/Agent';

describe('validateAgent', () => {
  const validAgent: Agent = {
    name: 'test-agent',
    role: Role.DEVELOPER,
    scope: {
      patterns: ['src/**'],
      readOnly: false,
    },
  };

  it('should accept valid agent', () => {
    expect(() => validateAgent(validAgent)).not.toThrow();
  });

  it('should reject agent without name', () => {
    const invalid = { ...validAgent, name: '' };
    expect(() => validateAgent(invalid)).toThrow(AgentValidationError);
  });

  it('should reject agent without role', () => {
    const invalid = { ...validAgent, role: undefined };
    expect(() => validateAgent(invalid)).toThrow(AgentValidationError);
  });

  it('should reject agent with invalid role', () => {
    const invalid = { ...validAgent, role: 'invalid-role' };
    expect(() => validateAgent(invalid)).toThrow(AgentValidationError);
  });

  it('should reject agent without scope', () => {
    const invalid = { ...validAgent, scope: undefined };
    expect(() => validateAgent(invalid)).toThrow(AgentValidationError);
  });

  it('should reject agent with empty scope patterns', () => {
    const invalid = { ...validAgent, scope: { patterns: [], readOnly: false } };
    expect(() => validateAgent(invalid)).toThrow(AgentValidationError);
  });

  it('should reject agent with non-boolean readOnly', () => {
    const invalid = { ...validAgent, scope: { patterns: ['src/**'], readOnly: 'yes' } };
    expect(() => validateAgent(invalid)).toThrow(AgentValidationError);
  });

  it('should reject non-object input', () => {
    expect(() => validateAgent(null)).toThrow(AgentValidationError);
    expect(() => validateAgent('not an object')).toThrow(AgentValidationError);
  });

  it('should reject agent with whitespace-only name', () => {
    const invalid = { ...validAgent, name: '   ' };
    expect(() => validateAgent(invalid)).toThrow(AgentValidationError);
  });

  it('should accept agent with glob patterns', () => {
    const agent = {
      ...validAgent,
      scope: { patterns: ['src/**/*.ts', 'tests/**/*.spec.ts'], readOnly: false },
    };
    expect(() => validateAgent(agent)).not.toThrow();
  });

  it('should accept agent with multiple valid patterns', () => {
    const agent = {
      ...validAgent,
      scope: { patterns: ['src/**', 'tests/**', 'lib/**'], readOnly: false },
    };
    expect(() => validateAgent(agent)).not.toThrow();
  });

  it('should accept agent with readOnly true', () => {
    const agent = { ...validAgent, scope: { patterns: ['docs/**'], readOnly: true } };
    expect(() => validateAgent(agent)).not.toThrow();
  });
});
