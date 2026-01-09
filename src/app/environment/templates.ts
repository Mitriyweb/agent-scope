/**
 * Configuration template management
 */

import * as fs from 'fs';
import * as path from 'path';
import { IDEConfig, AIToolConfig, EnvironmentSetupResult } from './types';

export class TemplateManager {
  private static readonly TEMPLATE_BASE_PATH = path.join(__dirname, '..', '..', '..', 'templates');

  /**
   * Copy IDE configuration templates to project
   */
  static async copyIDETemplates(
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
        await this.copyIDETemplate(projectPath, ide, result);
      } catch (error) {
        result.success = false;
        result.errors.push(`Failed to copy ${ide.name} template: ${error}`);
      }
    }

    return result;
  }

  /**
   * Copy AI tool configuration templates to project
   */
  static async copyAIToolTemplates(
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
        await this.copyAIToolTemplate(projectPath, tool, result);
      } catch (error) {
        result.success = false;
        result.errors.push(`Failed to copy ${tool.name} template: ${error}`);
      }
    }

    return result;
  }

  private static async copyIDETemplate(
    projectPath: string,
    ide: IDEConfig,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const templatePath = path.join(this.TEMPLATE_BASE_PATH, ide.templatePath);

    if (!fs.existsSync(templatePath)) {
      // Create default templates if they don't exist
      await this.createDefaultIDETemplate(projectPath, ide, result);
      return;
    }

    const targetDir = this.getIDETargetDirectory(projectPath, ide.id);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    for (const configFile of ide.configFiles) {
      const sourcePath = path.join(templatePath, configFile);
      const targetPath = path.join(targetDir, configFile);

      if (fs.existsSync(sourcePath)) {
        if (!fs.existsSync(targetPath)) {
          fs.copyFileSync(sourcePath, targetPath);
          result.createdFiles.push(targetPath);
        } else {
          result.warnings.push(`${configFile} already exists for ${ide.name}`);
        }
      }
    }
  }

  private static async copyAIToolTemplate(
    projectPath: string,
    tool: AIToolConfig,
    result: EnvironmentSetupResult
  ): Promise<void> {
    if (tool.type === 'universal') {
      // Handle universal AGENTS.md format
      await this.createUniversalAgentsConfig(projectPath, tool, result);
      return;
    }

    // For specific tools like Windsurf, create their configurations directly
    if (tool.id === 'windsurf') {
      await this.createWindsurfConfig(projectPath, result);
      return;
    }

    // Other tools don't need special setup for minimal configuration
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

  private static async createDefaultIDETemplate(
    projectPath: string,
    ide: IDEConfig,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const targetDir = this.getIDETargetDirectory(projectPath, ide.id);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    switch (ide.id) {
      case 'vscode':
        await this.createVSCodeDefaults(targetDir, result);
        break;
      case 'kiro':
        await this.createKiroDefaults(targetDir, result);
        break;
      case 'cursor':
        await this.createCursorDefaults(targetDir, result);
        break;
      case 'webstorm':
      case 'intellij':
      case 'pycharm':
        await this.createJetBrainsDefaults(targetDir, ide.id, result);
        break;
      case 'sublime':
        await this.createSublimeDefaults(targetDir, result);
        break;
      case 'atom':
        await this.createAtomDefaults(targetDir, result);
        break;
      case 'vim':
        await this.createVimDefaults(targetDir, result);
        break;
      case 'emacs':
        await this.createEmacsDefaults(targetDir, result);
        break;
      case 'nova':
        await this.createNovaDefaults(targetDir, result);
        break;
      case 'brackets':
        await this.createBracketsDefaults(targetDir, result);
        break;
    }
  }

  private static async createUniversalAgentsConfig(
    projectPath: string,
    _tool: AIToolConfig,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const agentsPath = path.join(projectPath, '.agent', 'AGENTS.md');

    if (fs.existsSync(agentsPath)) {
      result.warnings.push(
        'AGENTS.md already exists - Universal AI tools will use existing configuration'
      );
    } else {
      result.warnings.push('Universal AI tools will use the existing AGENTS.md configuration');
    }
  }

  private static async createVSCodeDefaults(
    targetDir: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const settings = {
      'editor.formatOnSave': true,
      'editor.codeActionsOnSave': {
        'source.fixAll': true,
      },
      'typescript.preferences.importModuleSpecifier': 'relative',
      'agent-scope.enabled': true,
    };

    const extensions = {
      recommendations: [
        'ms-vscode.vscode-typescript-next',
        'esbenp.prettier-vscode',
        'ms-vscode.vscode-json',
      ],
    };

    const launch = {
      version: '0.2.0',
      configurations: [
        {
          name: 'Debug agent-scope',
          type: 'node',
          request: 'launch',
          program: '${workspaceFolder}/bin/agent-scope',
          args: ['--help'],
          console: 'integratedTerminal',
        },
      ],
    };

    const tasks = {
      version: '2.0.0',
      tasks: [
        {
          label: 'Build',
          type: 'npm',
          script: 'build',
          group: 'build',
        },
        {
          label: 'Test',
          type: 'npm',
          script: 'test',
          group: 'test',
        },
      ],
    };

    const files = [
      { name: 'settings.json', content: settings },
      { name: 'extensions.json', content: extensions },
      { name: 'launch.json', content: launch },
      { name: 'tasks.json', content: tasks },
    ];

    for (const file of files) {
      const filePath = path.join(targetDir, file.name);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(file.content, null, 2));
        result.createdFiles.push(filePath);
      }
    }
  }

  private static async createKiroDefaults(
    targetDir: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const kiroConfig = {
      project: {
        name: 'agent-scope-project',
        type: 'agent-scope',
        version: '1.0.0',
      },
      agents: {
        enabled: true,
        configPath: '.agent/AGENTS.md',
      },
    };

    const agentsConfig = {
      agents: [
        {
          name: 'developer',
          role: 'developer',
          scope: 'full',
        },
        {
          name: 'qa',
          role: 'qa',
          scope: 'testing',
        },
      ],
    };

    const files = [
      { name: 'kiro.config.json', content: kiroConfig },
      { name: 'agents.config.json', content: agentsConfig },
    ];

    for (const file of files) {
      const filePath = path.join(targetDir, file.name);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(file.content, null, 2));
        result.createdFiles.push(filePath);
      }
    }
  }

  private static async createVimDefaults(
    targetDir: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const vimrc = `" Agent-scope Vim configuration
set number
set tabstop=2
set shiftwidth=2
set expandtab
set autoindent

" Enable syntax highlighting
syntax on

" Agent-scope specific settings
let g:agent_scope_enabled = 1
`;

    const initLua = `-- Agent-scope Neovim configuration
vim.opt.number = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true
vim.opt.autoindent = true

-- Agent-scope specific settings
vim.g.agent_scope_enabled = 1
`;

    const files = [
      { name: '.vimrc', content: vimrc },
      { name: 'init.lua', content: initLua },
    ];

    for (const file of files) {
      const filePath = path.join(targetDir, file.name);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, file.content);
        result.createdFiles.push(filePath);
      }
    }
  }

  private static async createEmacsDefaults(
    targetDir: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const initEl = `;; Agent-scope Emacs configuration
(setq-default indent-tabs-mode nil)
(setq-default tab-width 2)
(setq js-indent-level 2)
(setq typescript-indent-level 2)

;; Enable line numbers
(global-display-line-numbers-mode 1)

;; Agent-scope specific settings
(setq agent-scope-enabled t)

;; Load additional agent-scope configurations
(when (file-exists-p "~/.agent/emacs-config.el")
  (load "~/.agent/emacs-config.el"))
`;

    const filePath = path.join(targetDir, 'init.el');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, initEl);
      result.createdFiles.push(filePath);
    }
  }

  private static async createCursorDefaults(
    targetDir: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const cursorConfig = {
      'cursor.enabled': true,
      'cursor.autoComplete': true,
      'cursor.agentScope': {
        enabled: true,
        configPath: '.agent/AGENTS.md',
      },
    };

    const settings = {
      'editor.formatOnSave': true,
      'editor.codeActionsOnSave': {
        'source.fixAll': true,
      },
      'agent-scope.enabled': true,
    };

    const files = [
      { name: 'cursor.config.json', content: cursorConfig },
      { name: 'settings.json', content: settings },
    ];

    for (const file of files) {
      const filePath = path.join(targetDir, file.name);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(file.content, null, 2));
        result.createdFiles.push(filePath);
      }
    }
  }

  private static async createJetBrainsDefaults(
    targetDir: string,
    _ideType: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const workspaceXml = `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="ChangeListManager">
    <list default="true" id="agent-scope-changes" name="Default Changelist" comment="" />
  </component>
  <component name="ProjectViewState">
    <option name="hideEmptyMiddlePackages" value="true" />
    <option name="showLibraryContents" value="true" />
  </component>
  <component name="PropertiesComponent">
    <property name="agent-scope.enabled" value="true" />
    <property name="nodejs_package_manager_path" value="npm" />
  </component>
</project>`;

    const modulesXml = `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="ProjectModuleManager">
    <modules>
      <module fileurl="file://$PROJECT_DIR$/.idea/agent-scope.iml" filepath="$PROJECT_DIR$/.idea/agent-scope.iml" />
    </modules>
  </component>
</project>`;

    const files = [
      { name: 'workspace.xml', content: workspaceXml },
      { name: 'modules.xml', content: modulesXml },
    ];

    for (const file of files) {
      const filePath = path.join(targetDir, file.name);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, file.content);
        result.createdFiles.push(filePath);
      }
    }
  }

  private static async createSublimeDefaults(
    targetDir: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const projectConfig = {
      folders: [
        {
          path: '.',
        },
      ],
      settings: {
        tab_size: 2,
        translate_tabs_to_spaces: true,
        agent_scope_enabled: true,
      },
      build_systems: [
        {
          name: 'Agent Scope Build',
          cmd: ['npm', 'run', 'build'],
          working_dir: '$project_path',
        },
      ],
    };

    const filePath = path.join(targetDir, 'project.sublime-project');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(projectConfig, null, 2));
      result.createdFiles.push(filePath);
    }
  }

  private static async createAtomDefaults(
    targetDir: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const atomBuild = {
      cmd: 'npm',
      args: ['run', 'build'],
      cwd: '{PROJECT_PATH}',
      sh: false,
      atomCommandName: 'agent-scope:build',
      targets: {
        'Agent Scope Build': {
          cmd: 'npm',
          args: ['run', 'build'],
        },
        'Agent Scope Test': {
          cmd: 'npm',
          args: ['test'],
        },
      },
    };

    const filePath = path.join(targetDir, '.atom-build.json');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(atomBuild, null, 2));
      result.createdFiles.push(filePath);
    }
  }

  private static async createNovaDefaults(
    targetDir: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const novaConfig = {
      name: 'Agent Scope Project',
      type: 'node',
      settings: {
        'editor.tabSize': 2,
        'editor.insertSpaces': true,
        'agent-scope.enabled': true,
      },
      tasks: [
        {
          name: 'Build',
          command: 'npm',
          args: ['run', 'build'],
        },
        {
          name: 'Test',
          command: 'npm',
          args: ['test'],
        },
      ],
    };

    const filePath = path.join(targetDir, 'nova.config.json');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(novaConfig, null, 2));
      result.createdFiles.push(filePath);
    }
  }

  private static async createBracketsDefaults(
    targetDir: string,
    result: EnvironmentSetupResult
  ): Promise<void> {
    const bracketsConfig = {
      spaceUnits: 2,
      useTabChar: false,
      closeBrackets: true,
      showLineNumbers: true,
      styleActiveLine: true,
      wordWrap: true,
      'agent-scope': {
        enabled: true,
        configPath: '.agent/AGENTS.md',
      },
    };

    const filePath = path.join(targetDir, '.brackets.json');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(bracketsConfig, null, 2));
      result.createdFiles.push(filePath);
    }
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
    if (!content.includes('trigger:')) {
      // Add trigger directive in YAML frontmatter format at the very beginning
      content = '---\ntrigger: always_on\n---\n' + content;
    }

    fs.writeFileSync(destPath, content);
    result.createdFiles.push(destPath);
  }
}
