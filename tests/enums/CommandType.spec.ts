import { CommandType } from '@/enums/CommandType';

describe('CommandType', (): void => {
  it('should have Help enum value', (): void => {
    expect(CommandType.Help).toBe('help');
  });

  it('should have Version enum value', (): void => {
    expect(CommandType.Version).toBe('version');
  });

  it('should have exactly two enum values', (): void => {
    const values = Object.values(CommandType);
    expect(values).toHaveLength(2);
  });
});
