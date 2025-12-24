export interface Preset {
  name: string;
  type: 'role' | 'flow';
  content: Record<string, unknown>;
}

export class PresetManager {
  private presets: Record<string, Preset> = {
    'standard-roles': {
      name: 'standard-roles',
      type: 'role',
      content: {
        roles: [
          { name: 'developer', responsibilities: ['Code implementation', 'Testing'] },
          { name: 'qa', responsibilities: ['Quality assurance', 'Test planning'] },
          { name: 'architect', responsibilities: ['System design', 'Architecture'] },
          { name: 'reviewer', responsibilities: ['Code review', 'Approval'] },
        ],
      },
    },
    'sequential-flow': {
      name: 'sequential-flow',
      type: 'flow',
      content: {
        pattern: 'sequential',
        description: 'Linear flow where each node depends on previous',
      },
    },
    'parallel-flow': {
      name: 'parallel-flow',
      type: 'flow',
      content: {
        pattern: 'parallel',
        description: 'Multiple nodes executing in parallel',
      },
    },
  };

  listPresets(type?: 'role' | 'flow'): Preset[] {
    const all = Object.values(this.presets);
    return type ? all.filter((p) => p.type === type) : all;
  }

  getPreset(name: string): Preset | undefined {
    return this.presets[name];
  }

  applyPreset(name: string): Record<string, unknown> | null {
    const preset = this.getPreset(name);
    return preset ? preset.content : null;
  }
}
