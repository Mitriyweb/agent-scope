/**
 * Types for development environment setup
 */

export interface IDEConfig {
  id: string;
  name: string;
  description: string;
  configFiles: string[];
  templatePath: string;
}

export interface AIToolConfig {
  id: string;
  name: string;
  description: string;
  type: 'api' | 'cli' | 'extension' | 'universal';
  configFiles: string[];
  templatePath?: string;
  requiresApiKey?: boolean;
  supportsUniversalAgents?: boolean;
}

export interface EnvironmentSelection {
  ides: string[];
  aiTools: string[];
}

export interface EnvironmentSetupResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  createdFiles: string[];
}
