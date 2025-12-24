import { PresetManager } from '@/templates/PresetManager';

describe('PresetManager', () => {
  let manager: PresetManager;

  beforeEach(() => {
    manager = new PresetManager();
  });

  it('should list all presets', () => {
    const presets = manager.listPresets();

    expect(presets.length).toBeGreaterThan(0);
  });

  it('should filter presets by type', () => {
    const rolePresets = manager.listPresets('role');

    expect(rolePresets.every((p: { type: string }) => p.type === 'role')).toBe(true);
  });

  it('should get preset by name', () => {
    const preset = manager.getPreset('standard-roles');

    expect(preset).toBeDefined();
    expect(preset?.name).toBe('standard-roles');
  });

  it('should return undefined for unknown preset', () => {
    const preset = manager.getPreset('unknown');

    expect(preset).toBeUndefined();
  });

  it('should apply preset and return content', () => {
    const content = manager.applyPreset('standard-roles');

    expect(content).toBeDefined();
    expect(content).toHaveProperty('roles');
  });

  it('should return null for unknown preset application', () => {
    const content = manager.applyPreset('unknown');

    expect(content).toBeNull();
  });

  it('should have flow presets', () => {
    const flowPresets = manager.listPresets('flow');

    expect(flowPresets.length).toBeGreaterThan(0);
  });

  it('should have role presets', () => {
    const rolePresets = manager.listPresets('role');

    expect(rolePresets.length).toBeGreaterThan(0);
  });
});
