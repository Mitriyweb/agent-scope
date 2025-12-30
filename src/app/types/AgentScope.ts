/**
 * Types and interfaces for agent-scope multi-agent workflow system
 */

/**
 * Agent scope commands
 */
export enum AgentScopeCommand {
  Init = 'init',
  Agent = 'agent',
  Workflow = 'workflow',
}

/**
 * Agent subcommands
 */
export enum AgentSubcommand {
  Add = 'add',
  Remove = 'remove',
  List = 'list',
  Validate = 'validate',
}

/**
 * Workflow subcommands
 */
export enum WorkflowSubcommand {
  Run = 'run',
  List = 'list',
  Validate = 'validate',
}

/**
 * Agent definition structure
 */
export interface AgentDefinition {
  name: string;
  purpose: string;
  responsibilities: string[];
  constraints: string[];
  inputContract: {
    expectedInputs: string[];
    prerequisites: string[];
  };
  outputContract: {
    expectedOutputs: string[];
    successCriteria: string[];
  };
  errorHandling: string[];
}

/**
 * Workflow definition structure
 */
export interface WorkflowDefinition {
  name: string;
  description: string;
  phases: WorkflowPhase[];
  openspecIntegration: string[];
  successCriteria: string[];
}

/**
 * Workflow phase definition
 */
export interface WorkflowPhase {
  name: string;
  agent: string;
  approvalRequired: boolean;
  inputs: string[];
  outputs: string[];
}

/**
 * Workflow dependency information
 */
export interface WorkflowDependency {
  workflow: string;
  line: number;
  context: string;
}

/**
 * Agent validation result
 */
export interface AgentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Workflow validation result
 */
export interface WorkflowValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missingAgents: string[];
}

/**
 * OpenSpec detection result
 */
export interface OpenSpecDetectionResult {
  installed: boolean;
  version: string | null;
  warningMessage: string | null;
}
