/**
 * Main environment setup orchestrator
 */

export * from './types';
export * from './detectors';
export * from './templates';
export * from './ai-tools';
export * from './validator';
export * from './prompts';

import { EnvironmentDetector } from './detectors';
import { TemplateManager } from './templates';
import { AIToolsManager } from './ai-tools';
import { ConfigValidator } from './validator';
import { EnvironmentSelection, EnvironmentSetupResult } from './types.js';

export class EnvironmentSetup {
  /**
   * Get available development environment options
   */
  static getAvailableOptions() {
    return {
      ides: EnvironmentDetector.getAvailableIDEs(),
      aiTools: EnvironmentDetector.getAvailableAITools(),
    };
  }

  /**
   * Detect existing environment configurations
   */
  static detectExisting(projectPath: string) {
    return {
      ides: EnvironmentDetector.detectExistingIDEs(projectPath),
      aiTools: EnvironmentDetector.detectExistingAITools(projectPath),
    };
  }

  /**
   * Setup complete development environment
   */
  static async setupEnvironment(
    projectPath: string,
    selection: EnvironmentSelection
  ): Promise<EnvironmentSetupResult> {
    const result: EnvironmentSetupResult = {
      success: true,
      errors: [],
      warnings: [],
      createdFiles: [],
    };

    try {
      const options = this.getAvailableOptions();

      // Get selected configurations
      const selectedIDEs = options.ides.filter(ide => selection.ides.includes(ide.id));
      const selectedAITools = options.aiTools.filter(tool => selection.aiTools.includes(tool.id));

      // Check for conflicts before setup
      const conflictCheck = await ConfigValidator.checkForConflicts(
        projectPath,
        selectedIDEs,
        selectedAITools
      );
      result.warnings.push(...conflictCheck.warnings);
      result.errors.push(...conflictCheck.errors);

      if (!conflictCheck.success) {
        result.success = false;
        return result;
      }

      // Setup IDE configurations
      if (selectedIDEs.length > 0) {
        const ideResult = await TemplateManager.copyIDETemplates(projectPath, selectedIDEs);
        result.createdFiles.push(...ideResult.createdFiles);
        result.warnings.push(...ideResult.warnings);
        result.errors.push(...ideResult.errors);

        if (!ideResult.success) {
          result.success = false;
        }
      }

      // Setup AI tools
      if (selectedAITools.length > 0) {
        const aiResult = await AIToolsManager.setupAITools(
          projectPath,
          selection.aiTools,
          selectedAITools
        );
        result.createdFiles.push(...aiResult.createdFiles);
        result.warnings.push(...aiResult.warnings);
        result.errors.push(...aiResult.errors);

        if (!aiResult.success) {
          result.success = false;
        }
      }

      // Validate all configurations
      if (result.success) {
        const ideValidation = await ConfigValidator.validateIDEConfigs(projectPath, selectedIDEs);
        const aiValidation = await ConfigValidator.validateAIToolConfigs(
          projectPath,
          selectedAITools
        );

        result.warnings.push(...ideValidation.warnings);
        result.warnings.push(...aiValidation.warnings);
        result.errors.push(...ideValidation.errors);
        result.errors.push(...aiValidation.errors);

        if (!ideValidation.success || !aiValidation.success) {
          result.success = false;
        }
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`Environment setup failed: ${error}`);
    }

    return result;
  }

  /**
   * Update existing environment configurations
   */
  static async updateEnvironment(projectPath: string): Promise<EnvironmentSetupResult> {
    const result: EnvironmentSetupResult = {
      success: true,
      errors: [],
      warnings: [],
      createdFiles: [],
    };

    try {
      // Detect existing configurations
      const existing = this.detectExisting(projectPath);

      if (existing.ides.length === 0 && existing.aiTools.length === 0) {
        result.warnings.push('No existing environment configurations found to update');
        return result;
      }

      // Re-setup existing configurations with latest templates
      const selection: EnvironmentSelection = {
        ides: existing.ides,
        aiTools: existing.aiTools,
      };

      const updateResult = await this.setupEnvironment(projectPath, selection);

      // Merge results
      result.success = updateResult.success;
      result.errors.push(...updateResult.errors);
      result.warnings.push(...updateResult.warnings);
      result.createdFiles.push(...updateResult.createdFiles);

      if (result.success) {
        result.warnings.push('Environment configurations updated successfully');
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`Environment update failed: ${error}`);
    }

    return result;
  }
}
