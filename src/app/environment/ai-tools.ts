/**
 * AI Tools integration framework
 */

import * as fs from 'fs';
import * as path from 'path';
import { AIToolConfig, EnvironmentSetupResult } from './types';

export class AIToolsManager {
  /**
   * Setup AI tool integrations
   */
  static async setupAITools(
    projectPath: string,
    selectedTools: string[],
    availableTools: AIToolConfig[]
  ): Promise<EnvironmentSetupResult> {
    const result: EnvironmentSetupResult = {
      success: true,
      errors: [],
      warnings: [],
      createdFiles: [],
    };

    const toolsToSetup = availableTools.filter(tool => selectedTools.includes(tool.id));

    for (const tool of toolsToSetup) {
      try {
        await this.setupAITool(projectPath, tool, result);
      } catch (error) {
        result.success = false;
        result.errors.push(`Failed to setup ${tool.name}: ${error}`);
      }
    }

    // Create master AI tools configuration
    await this.createMasterConfig(projectPath, toolsToSetup, result);

    return result;
  }

  private static async setupAITool(
    projectPath: string,
    tool: AIToolConfig,
    result: EnvironmentSetupResult
  ): Promise<void> {
    // Use the TemplateManager to create specific configurations
    const templateModule = await import('./templates.js');
    const templateResult = await templateModule.TemplateManager.copyAIToolTemplates(projectPath, [
      tool,
    ]);

    // Merge results from template creation
    result.createdFiles.push(...templateResult.createdFiles);
    result.warnings.push(...templateResult.warnings);
    result.errors.push(...templateResult.errors);
    if (!templateResult.success) {
      result.success = false;
    }

    // Call the specific configuration creation based on tool ID
    switch (tool.id) {
      case 'windsurf':
        await this.createWindsurfConfig(projectPath, result);
        break;
      case 'cursor':
        await this.createCursorConfig(projectPath, result);
        break;
      case 'github-copilot':
        await this.createGitHubCopilotConfig(projectPath, result);
        break;
      case 'claude-code':
        await this.createClaudeCodeConfig(projectPath, result);
        break;
      case 'cline':
        await this.createClineConfig(projectPath, result);
        break;
      default:
        // Handle by type for other tools
        switch (tool.type) {
          case 'api':
            await this.setupAPITool(projectPath, tool, result);
            break;
          case 'cli':
            await this.setupCLITool(projectPath, tool, result);
            break;
          case 'extension':
            await this.setupExtensionTool(projectPath, tool, result);
            break;
          case 'universal':
            await this.setupUniversalTool(projectPath, tool, result);
            break;
        }
        break;
    }
  }

  private static async setupAPITool(
    _projectPath: string,
    _tool: AIToolConfig,
    _result: EnvironmentSetupResult
  ): Promise<void> {
    // API tools don't need special setup for minimal configuration
  }

  private static async setupCLITool(
    _projectPath: string,
    _tool: AIToolConfig,
    _result: EnvironmentSetupResult
  ): Promise<void> {
    // CLI tools don't need special setup for minimal configuration
  }

  private static async setupExtensionTool(
    _projectPath: string,
    _tool: AIToolConfig,
    _result: EnvironmentSetupResult
  ): Promise<void> {
    // Extension tools don't need special setup for minimal configuration
  }

  private static async setupUniversalTool(
    projectPath: string,
    tool: AIToolConfig,
    result: EnvironmentSetupResult
  ): Promise<void> {
    // Universal tools use the existing AGENTS.md file
    const agentsPath = path.join(projectPath, '.agent', 'AGENTS.md');

    if (fs.existsSync(agentsPath)) {
      result.warnings.push(`${tool.name} will use the existing AGENTS.md configuration`);
    } else {
      result.warnings.push(
        `${tool.name} requires AGENTS.md file (will be created by init command)`
      );
    }
  }

  private static async createMasterConfig(
    _projectPath: string,
    _tools: AIToolConfig[],
    _result: EnvironmentSetupResult
  ): Promise<void> {
    // Master config is not needed for minimal setup
  }

  // AI Tool specific configurations
  private static async createWindsurfConfig(
    projectPath: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const windsurfDir = path.join(projectPath, '.windsurf');
    const agentDir = path.join(projectPath, '.agent');

    if (!fs.existsSync(windsurfDir)) {
      fs.mkdirSync(windsurfDir, { recursive: true });
      result.createdFiles.push(windsurfDir);
    }

    // Copy all contents from .agent to .windsurf
    if (fs.existsSync(agentDir)) {
      this.copyDirectoryRecursive(agentDir, windsurfDir, result);
    }
  }

  private static copyDirectoryRecursive(
    source: string,
    destination: string,
    result: EnvironmentSetupResult
  ): void {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const files = fs.readdirSync(source);

    for (const file of files) {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);
      const stat = fs.statSync(sourcePath);

      if (stat.isDirectory()) {
        this.copyDirectoryRecursive(sourcePath, destPath, result);
      } else {
        if (!fs.existsSync(destPath)) {
          // Check if this is a rules file that needs trigger metadata
          if (source.includes('rules') && file.endsWith('.md')) {
            this.copyRuleFileWithTrigger(sourcePath, destPath, result);
          } else {
            fs.copyFileSync(sourcePath, destPath);
            result.createdFiles.push(destPath);
          }
        }
      }
    }
  }

  private static copyRuleFileWithTrigger(
    sourcePath: string,
    destPath: string,
    result: EnvironmentSetupResult
  ): void {
    let content = fs.readFileSync(sourcePath, 'utf-8');

    // Check if the file already has a trigger directive
    if (!content.includes('---trigger:')) {
      // Add trigger directive at the very beginning
      content = '---trigger: always_on---\n' + content;
    }

    fs.writeFileSync(destPath, content);
    result.createdFiles.push(destPath);
  }

  private static async createCursorConfig(
    _projectPath: string,
    _result: EnvironmentSetupResult
  ): Promise<void> {
    // Cursor uses VS Code settings
  }

  private static async createGitHubCopilotConfig(
    _projectPath: string,
    _result: EnvironmentSetupResult
  ): Promise<void> {
    // GitHub Copilot uses VS Code settings
  }

  private static async createClaudeCodeConfig(
    _projectPath: string,
    _result: EnvironmentSetupResult
  ): Promise<void> {
    // Claude Code uses VS Code settings
  }

  private static async createClineConfig(
    _projectPath: string,
    _result: EnvironmentSetupResult
  ): Promise<void> {
    // Cline uses VS Code settings
  }
}
