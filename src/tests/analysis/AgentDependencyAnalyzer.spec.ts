import { AgentDependencyAnalyzer } from '@/analysis/AgentDependencyAnalyzer';
import * as fs from 'fs';

jest.mock('fs');

describe('AgentDependencyAnalyzer', () => {
  const mockedFs = fs as jest.Mocked<typeof fs>;
  let analyzer: AgentDependencyAnalyzer;
  const testWorkflowsDir = '.agent-scope/workflows';

  beforeEach(() => {
    analyzer = new AgentDependencyAnalyzer(testWorkflowsDir);
    jest.clearAllMocks();
  });

  describe('findWorkflowsUsingAgent', () => {
    it('should return empty array when workflows directory does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false);

      const result = analyzer.findWorkflowsUsingAgent('architect');

      expect(result).toEqual([]);
    });

    it('should find agent references in workflow files', () => {
      const workflowContent = `# Test Workflow

## Phase 1
**Agent:** \`architect\`
Some description

## Phase 2
**Agent:** \`developer\`
`;

      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(['test-workflow.md']);
      mockedFs.readFileSync.mockReturnValue(workflowContent);

      const result = analyzer.findWorkflowsUsingAgent('architect');

      expect(result).toHaveLength(1);
      expect(result[0].workflow).toBe('test-workflow.md');
      expect(result[0].line).toBe(4);
      expect(result[0].context).toContain('architect');
    });

    it('should find multiple references in same file', () => {
      const workflowContent = `# Test Workflow

**Agent:** \`architect\`

Some content

**Agent:** \`architect\`
`;

      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(['test-workflow.md']);
      mockedFs.readFileSync.mockReturnValue(workflowContent);

      const result = analyzer.findWorkflowsUsingAgent('architect');

      expect(result).toHaveLength(2);
      expect(result[0].line).toBe(3);
      expect(result[1].line).toBe(7);
    });

    it('should find references across multiple workflow files', () => {
      const workflow1 = '**Agent:** `architect`';
      const workflow2 = '**Agent:** `architect`';

      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(['workflow1.md', 'workflow2.md']);
      mockedFs.readFileSync.mockReturnValueOnce(workflow1).mockReturnValueOnce(workflow2);

      const result = analyzer.findWorkflowsUsingAgent('architect');

      expect(result).toHaveLength(2);
      expect(result[0].workflow).toBe('workflow1.md');
      expect(result[1].workflow).toBe('workflow2.md');
    });

    it('should not find agent when not referenced', () => {
      const workflowContent = '**Agent:** `developer`';

      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(['test-workflow.md']);
      mockedFs.readFileSync.mockReturnValue(workflowContent);

      const result = analyzer.findWorkflowsUsingAgent('architect');

      expect(result).toEqual([]);
    });

    it('should only process markdown files', () => {
      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue([
        'workflow.md',
        'readme.txt',
        'config.json',
      ]);
      mockedFs.readFileSync.mockReturnValue('**Agent:** `architect`');

      const result = analyzer.findWorkflowsUsingAgent('architect');

      expect(result).toHaveLength(1);
      expect(mockedFs.readFileSync).toHaveBeenCalledTimes(1);
    });
  });

  describe('formatDependencyWarning', () => {
    it('should return empty string when no dependencies', () => {
      const result = analyzer.formatDependencyWarning('architect', []);

      expect(result).toBe('');
    });

    it('should format warning message with dependencies', () => {
      const dependencies = [
        { workflow: 'workflow1.md', line: 10, context: '**Agent:** `architect`' },
        { workflow: 'workflow2.md', line: 5, context: '**Agent:** `architect`' },
      ];

      const result = analyzer.formatDependencyWarning('architect', dependencies);

      expect(result).toContain("Role 'architect' is used in workflows:");
      expect(result).toContain('workflow1.md (line 10)');
      expect(result).toContain('workflow2.md (line 5)');
      expect(result).toContain('Remove anyway? [y/N]');
    });
  });

  describe('hasDependencies', () => {
    it('should return true when agent has dependencies', () => {
      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(['test-workflow.md']);
      mockedFs.readFileSync.mockReturnValue('**Agent:** `architect`');

      const result = analyzer.hasDependencies('architect');

      expect(result).toBe(true);
    });

    it('should return false when agent has no dependencies', () => {
      mockedFs.existsSync.mockReturnValue(true);
      (mockedFs.readdirSync as jest.Mock).mockReturnValue(['test-workflow.md']);
      mockedFs.readFileSync.mockReturnValue('**Agent:** `developer`');

      const result = analyzer.hasDependencies('architect');

      expect(result).toBe(false);
    });
  });
});
