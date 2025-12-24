import { TemplateManager } from '@/templates/TemplateManager';

describe('TemplateManager', () => {
  let manager: TemplateManager;

  beforeEach(() => {
    manager = new TemplateManager();
  });

  it('should list available templates', () => {
    const templates = manager.listTemplates();

    expect(templates.length).toBeGreaterThan(0);
  });

  it('should get template by name', () => {
    const template = manager.getTemplate('basic-flow');

    expect(template).toBeDefined();
    expect(template?.name).toBe('basic-flow');
  });

  it('should return undefined for unknown template', () => {
    const template = manager.getTemplate('unknown');

    expect(template).toBeUndefined();
  });

  it('should have template files', () => {
    const template = manager.getTemplate('basic-flow');

    expect(template?.files).toBeDefined();
    expect(Object.keys(template?.files || {}).length).toBeGreaterThan(0);
  });

  it('should create project from template', () => {
    const result = manager.createFromTemplate('basic-flow', '/tmp/project');

    expect(result).toBe(true);
  });

  it('should return false for unknown template creation', () => {
    const result = manager.createFromTemplate('unknown', '/tmp/project');

    expect(result).toBe(false);
  });

  it('should have multi-agent template', () => {
    const template = manager.getTemplate('multi-agent');

    expect(template).toBeDefined();
    expect(template?.description).toContain('Multi-agent');
  });
});
