/**
 * Configuration validation system
 */

import * as fs from 'fs';
import * as path from 'path';
import { IDEConfig, AIToolConfig, EnvironmentSetupResult } from './types.js';

export class ConfigValidator {
  /**
   * Validate IDE configurations
   */
  static async validateIDEConfigs(
    projectPath: string,
    ideConfigs: IDEConfig[]
  ): Promise<EnvironmentSetupResult> {
    const result: EnvironmentSetupResult = {
      success: true,
      errors: [],
      warnings: [],
      createdFiles: [],
    };

    for (const ide of ideConfigs) {
      try {
        await this.validateIDEConfig(projectPath, ide, result);
      } catch (error) {
        result.success = false;
        result.errors.push(`Validation failed for ${ide.name}: ${error}`);
      }
    }

    return result;
  }

  /**
   * Validate AI tool configurations
   */
  static async validateAIToolConfigs(
    projectPath: string,
    aiToolConfigs: AIToolConfig[]
  ): Promise<EnvironmentSetupResult> {
    const result: EnvironmentSetupResult = {
      success: true,
      errors: [],
      warnings: [],
      createdFiles: [],
    };

    for (const tool of aiToolConfigs) {
      try {
        await this.validateAIToolConfig(projectPath, tool, result);
      } catch (error) {
        result.success = false;
        result.errors.push(`Validation failed for ${tool.name}: ${error}`);
      }
    }

    return result;
  }

  private static async validateIDEConfig(
    projectPath: string,
    ide: IDEConfig,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const targetDir = this.getIDETargetDirectory(projectPath, ide.id);

    if (!fs.existsSync(targetDir)) {
      result.warnings.push(`${ide.name} configuration directory does not exist: ${targetDir}`);
      return;
    }

    for (const configFile of ide.configFiles) {
      const configPath = path.join(targetDir, configFile);

      if (fs.existsSync(configPath)) {
        await this.validateConfigFile(configPath, ide.name, configFile, result);
      } else {
        result.warnings.push(`${ide.name} configuration file missing: ${configFile}`);
      }
    }
  }

  private static async validateAIToolConfig(
    projectPath: string,
    tool: AIToolConfig,
    result: EnvironmentSetupResult
  ): Promise<void> {
    if (tool.type === 'universal') {
      // Validate AGENTS.md exists
      const agentsPath = path.join(projectPath, '.agent', 'AGENTS.md');
      if (!fs.existsSync(agentsPath)) {
        result.warnings.push(`${tool.name} requires AGENTS.md file`);
      }
      return;
    }

    if (tool.id === 'windsurf') {
      // Validate .windsurf/settings.json exists
      const settingsPath = path.join(projectPath, '.windsurf', 'settings.json');
      if (!fs.existsSync(settingsPath)) {
        result.warnings.push(`${tool.name} settings file missing: ${settingsPath}`);
      }
      return;
    }
  }

  private static async validateConfigFile(
    configPath: string,
    toolName: string,
    fileName: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    try {
      const content = fs.readFileSync(configPath, 'utf-8');

      // Validate JSON files
      if (fileName.endsWith('.json')) {
        try {
          JSON.parse(content);
        } catch (jsonError) {
          result.errors.push(`Invalid JSON in ${toolName} ${fileName}: ${jsonError}`);
          return;
        }
      }

      // Validate specific file types
      if (fileName === 'settings.json') {
        await this.validateVSCodeSettings(content, result);
      } else if (fileName === 'extensions.json') {
        await this.validateVSCodeExtensions(content, result);
      } else if (fileName.endsWith('.config.json')) {
        await this.validateAIToolConfigContent(content, toolName, result);
      }
    } catch (error) {
      result.errors.push(`Cannot read ${toolName} ${fileName}: ${error}`);
    }
  }

  private static async validateVSCodeSettings(
    content: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    try {
      const settings = JSON.parse(content);

      // Check for common issues
      if (settings['editor.formatOnSave'] === undefined) {
        result.warnings.push(
          'VS Code: Consider enabling editor.formatOnSave for better code formatting'
        );
      }

      if (settings['typescript.preferences.importModuleSpecifier'] !== 'relative') {
        result.warnings.push(
          'VS Code: Consider setting typescript.preferences.importModuleSpecifier to "relative"'
        );
      }
    } catch (error) {
      result.errors.push(`Invalid VS Code settings.json: ${error}`);
    }
  }

  private static async validateVSCodeExtensions(
    content: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    try {
      const extensions = JSON.parse(content);

      if (!extensions.recommendations || !Array.isArray(extensions.recommendations)) {
        result.warnings.push('VS Code: extensions.json should have a recommendations array');
      }

      if (extensions.recommendations && extensions.recommendations.length === 0) {
        result.warnings.push('VS Code: No extension recommendations found');
      }
    } catch (error) {
      result.errors.push(`Invalid VS Code extensions.json: ${error}`);
    }
  }

  private static async validateAIToolConfigContent(
    content: string,
    toolName: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    try {
      const config = JSON.parse(content);

      // Check required fields
      const requiredFields = ['name', 'type', 'enabled'];
      for (const field of requiredFields) {
        if (config[field] === undefined) {
          result.errors.push(`${toolName}: Missing required field '${field}' in configuration`);
        }
      }

      // Validate type
      const validTypes = ['api', 'cli', 'extension', 'universal'];
      if (config.type && !validTypes.includes(config.type)) {
        result.errors.push(
          `${toolName}: Invalid type '${config.type}'. Must be one of: ${validTypes.join(', ')}`
        );
      }
    } catch (error) {
      result.errors.push(`Invalid ${toolName} configuration JSON: ${error}`);
    }
  }

  private static getIDETargetDirectory(projectPath: string, ideId: string): string {
    switch (ideId) {
      case 'vscode':
        return path.join(projectPath, '.vscode');
      case 'kiro':
        return path.join(projectPath, '.kiro');
      case 'cursor':
        return path.join(projectPath, '.cursor');
      case 'webstorm':
      case 'intellij':
      case 'pycharm':
        return path.join(projectPath, '.idea');
      case 'sublime':
        return projectPath; // Root directory for .sublime-project files
      case 'atom':
        return projectPath; // Root directory for .atom-build.json
      case 'vim':
        return projectPath; // Root directory for .vimrc
      case 'emacs':
        return path.join(projectPath, '.emacs.d');
      case 'nova':
        return path.join(projectPath, '.nova');
      case 'brackets':
        return projectPath; // Root directory for .brackets.json
      default:
        return path.join(projectPath, `.${ideId}`);
    }
  }

  /**
   * Check for configuration conflicts between different tools
   */
  static async checkForConflicts(
    _projectPath: string,
    ideConfigs: IDEConfig[],
    aiToolConfigs: AIToolConfig[]
  ): Promise<EnvironmentSetupResult> {
    const result: EnvironmentSetupResult = {
      success: true,
      errors: [],
      warnings: [],
      createdFiles: [],
    };

    // Check for IDE conflicts
    const ideIds = ideConfigs.map(ide => ide.id);
    if (ideIds.includes('vim') && ideIds.includes('emacs')) {
      result.warnings.push(
        'Both Vim and Emacs configurations detected - this is unusual but not problematic'
      );
    }

    // Check for AI tool conflicts
    const apiTools = aiToolConfigs.filter(tool => tool.type === 'api');
    if (apiTools.length > 3) {
      result.warnings.push(
        `Many API-based AI tools configured (${apiTools.length}). Consider using only the tools you actively need.`
      );
    }

    // Check for extension conflicts in VS Code
    if (ideIds.includes('vscode')) {
      const extensionTools = aiToolConfigs.filter(tool => tool.type === 'extension');
      if (extensionTools.length > 2) {
        result.warnings.push(
          'Multiple AI extension tools may conflict in VS Code. Test thoroughly.'
        );
      }
    }

    return result;
  }
}
