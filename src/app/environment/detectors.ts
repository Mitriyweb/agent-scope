/**
 * Environment detection utilities
 */

import * as fs from 'fs';
import * as path from 'path';
import { IDEConfig, AIToolConfig } from './types.js';

export class EnvironmentDetector {
  /**
   * Get available IDE configurations
   */
  static getAvailableIDEs(): IDEConfig[] {
    return [
      {
        id: 'vscode',
        name: 'VS Code',
        description: 'Visual Studio Code with agent-scope optimized settings',
        configFiles: ['settings.json', 'extensions.json', 'launch.json', 'tasks.json'],
        templatePath: 'templates/ide/vscode',
      },
      {
        id: 'kiro',
        name: 'Kiro IDE',
        description: 'Kiro IDE with project settings and agent configurations',
        configFiles: ['kiro.config.json', 'agents.config.json'],
        templatePath: 'templates/ide/kiro',
      },
      {
        id: 'cursor',
        name: 'Cursor',
        description: 'Cursor IDE with AI-powered development features',
        configFiles: ['cursor.config.json', 'settings.json'],
        templatePath: 'templates/ide/cursor',
      },
      {
        id: 'webstorm',
        name: 'WebStorm',
        description: 'JetBrains WebStorm IDE configuration',
        configFiles: ['.idea/workspace.xml', '.idea/modules.xml'],
        templatePath: 'templates/ide/webstorm',
      },
      {
        id: 'intellij',
        name: 'IntelliJ IDEA',
        description: 'JetBrains IntelliJ IDEA configuration',
        configFiles: ['.idea/workspace.xml', '.idea/modules.xml'],
        templatePath: 'templates/ide/intellij',
      },
      {
        id: 'pycharm',
        name: 'PyCharm',
        description: 'JetBrains PyCharm IDE configuration',
        configFiles: ['.idea/workspace.xml', '.idea/modules.xml'],
        templatePath: 'templates/ide/pycharm',
      },
      {
        id: 'sublime',
        name: 'Sublime Text',
        description: 'Sublime Text editor with project settings',
        configFiles: ['project.sublime-project', 'project.sublime-workspace'],
        templatePath: 'templates/ide/sublime',
      },
      {
        id: 'atom',
        name: 'Atom',
        description: 'Atom editor configuration (legacy support)',
        configFiles: ['.atom-build.json'],
        templatePath: 'templates/ide/atom',
      },
      {
        id: 'vim',
        name: 'Vim/Neovim',
        description: 'Vim/Neovim with agent-scope plugin configurations',
        configFiles: ['.vimrc', 'init.lua'],
        templatePath: 'templates/ide/vim',
      },
      {
        id: 'emacs',
        name: 'Emacs',
        description: 'Emacs with agent-scope specific configurations',
        configFiles: ['init.el'],
        templatePath: 'templates/ide/emacs',
      },
      {
        id: 'nova',
        name: 'Nova',
        description: 'Panic Nova editor configuration',
        configFiles: ['nova.config.json'],
        templatePath: 'templates/ide/nova',
      },
      {
        id: 'brackets',
        name: 'Brackets',
        description: 'Adobe Brackets editor configuration',
        configFiles: ['.brackets.json'],
        templatePath: 'templates/ide/brackets',
      },
    ];
  }

  /**
   * Get available AI tool configurations
   */
  static getAvailableAITools(): AIToolConfig[] {
    return [
      {
        id: 'windsurf',
        name: 'Windsurf',
        description: 'Windsurf AI assistant',
        type: 'extension',
        configFiles: ['windsurf.config.json'],
        templatePath: 'templates/ai/windsurf',
      },
      {
        id: 'universal-agents',
        name: 'Universal agent',
        description: 'Any AI tool supporting AGENTS.md format',
        type: 'universal',
        configFiles: ['AGENTS.md'],
        supportsUniversalAgents: true,
      },
    ];
  }

  /**
   * Detect existing IDE configurations in the project
   */
  static detectExistingIDEs(projectPath: string): string[] {
    const detected: string[] = [];
    const ides = this.getAvailableIDEs();

    for (const ide of ides) {
      const hasConfig = ide.configFiles.some(configFile => {
        const configPath = path.join(projectPath, '.vscode', configFile);
        return fs.existsSync(configPath);
      });

      if (hasConfig) {
        detected.push(ide.id);
      }
    }

    return detected;
  }

  /**
   * Detect existing AI tool configurations in the project
   */
  static detectExistingAITools(projectPath: string): string[] {
    const detected: string[] = [];
    const aiTools = this.getAvailableAITools();

    for (const tool of aiTools) {
      let hasConfig = false;

      if (tool.id === 'windsurf') {
        // Windsurf uses .windsurf/settings.json
        const settingsPath = path.join(projectPath, '.windsurf', 'settings.json');
        hasConfig = fs.existsSync(settingsPath);
      } else if (tool.id === 'universal-agents') {
        // Universal agents check for AGENTS.md
        const agentsPath = path.join(projectPath, '.agent', 'AGENTS.md');
        hasConfig = fs.existsSync(agentsPath);
      } else {
        // Other tools use .agent/ai-tools directory
        hasConfig = tool.configFiles.some(configFile => {
          const configPath = path.join(projectPath, '.agent', 'ai-tools', configFile);
          return fs.existsSync(configPath);
        });
      }

      if (hasConfig) {
        detected.push(tool.id);
      }
    }

    return detected;
  }
}
