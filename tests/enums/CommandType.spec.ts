import { CommandType } from '@/enums/CommandType';

describe('CommandType', (): void => {
  it('should have Help enum value', (): void => {
    expect(CommandType.Help).toBe('help');
  });

  it('should have Version enum value', (): void => {
    expect(CommandType.Version).toBe('version');
  });

  it('should have Build enum value', (): void => {
    expect(CommandType.Build).toBe('build');
  });

  it('should have Execute enum value', (): void => {
    expect(CommandType.Execute).toBe('execute');
  });

  it('should have Init enum value', (): void => {
    expect(CommandType.Init).toBe('init');
  });

  it('should have exactly five enum values', (): void => {
    const values = Object.values(CommandType);
    expect(values).toHaveLength(5);
  });
});
