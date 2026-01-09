/**
 * Interactive prompts for environment setup
 */

import inquirer from 'inquirer';
import { IDEConfig, AIToolConfig, EnvironmentSelection } from './types.js';

export class EnvironmentPrompts {
  /**
   * Prompt for complete environment selection with interactive checkboxes
   */
  static async promptForEnvironmentSelection(
    _availableIDEs: IDEConfig[],
    availableAITools: AIToolConfig[]
  ): Promise<EnvironmentSelection | null> {
    console.log('\n🚀 Development Environment Setup');

    // Create choices array with only AI tools
    const choices = availableAITools.map(tool => ({
      name: tool.name + (tool.requiresApiKey ? ' ⚠️' : ''),
      value: `ai:${tool.id}`,
      checked: false,
    }));

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selections',
        message:
          'Which natively supported AI tools would you like to add or refresh?\nUse ↑/↓ to move · Space to toggle · Enter selects highlighted tool and reviews.',
        choices: choices,
        pageSize: 25,
        loop: false,
      },
    ]);

    if (!answers.selections || answers.selections.length === 0) {
      console.log('\nNo tools selected. Environment setup cancelled.');
      return null;
    }

    // Parse selections (only AI tools now)
    const selectedAIToolIds: string[] = [];

    for (const selection of answers.selections) {
      const [type, id] = selection.split(':');
      if (type === 'ai') {
        selectedAIToolIds.push(id);
      }
    }

    const selectedAITools = availableAITools.filter(tool => selectedAIToolIds.includes(tool.id));

    // Show confirmation
    console.log('\n📋 Configuration Summary');

    if (selectedAITools.length > 0) {
      console.log('\nSelected AI Tools:');
      selectedAITools.forEach(tool => {
        console.log(`  ✓ ${tool.name}${tool.requiresApiKey ? ' (requires API key)' : ''}`);
      });
    }

    const confirmAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Proceed with this configuration?',
        default: true,
      },
    ]);

    if (!confirmAnswer.proceed) {
      console.log('\nEnvironment setup cancelled.');
      return null;
    }

    return {
      ides: [], // No IDE selection for now
      aiTools: selectedAIToolIds,
    };
  }

  /**
   * Show setup results
   */
  static showResults(result: {
    success: boolean;
    errors: string[];
    warnings: string[];
    createdFiles: string[];
  }): void {
    console.log('\n🎉 Environment Setup Complete!');

    if (result.createdFiles.length > 0) {
      console.log('\nCreated files:');
      result.createdFiles.forEach(file => {
        console.log(`  ✓ ${file}`);
      });
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach(warning => {
        console.log(`  • ${warning}`);
      });
    }

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => {
        console.log(`  • ${error}`);
      });
    }

    if (result.success) {
      console.log('\n✅ Your development environment is ready!');
      console.log('You can update these configurations later using: agent-scope env update');
    } else {
      console.log(
        '\n❌ Environment setup completed with errors. Please review and fix the issues above.'
      );
    }
  }
}
