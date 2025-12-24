export interface DiagnosticError {
  type: string;
  message: string;
  context?: string;
  suggestion?: string;
  example?: string;
}

export class ErrorFormatter {
  static format(error: DiagnosticError, quiet = false): string {
    let output = `Error: ${error.message}`;

    if (!quiet) {
      if (error.context) {
        output += `\n\nContext: ${error.context}`;
      }
      if (error.suggestion) {
        output += `\n\nSuggestion: ${error.suggestion}`;
      }
      if (error.example) {
        output += `\n\nExample:\n${error.example}`;
      }
    }

    return output;
  }

  static validationError(nodeId: string, message: string): DiagnosticError {
    return {
      type: 'validation',
      message: `Flow validation failed: ${message}`,
      context: `Node: ${nodeId}`,
      suggestion: 'Check flow definition and ensure all nodes are properly configured',
    };
  }

  static fileNotFound(filePath: string): DiagnosticError {
    return {
      type: 'file_not_found',
      message: `File not found: ${filePath}`,
      suggestion: 'Check the file path and ensure it exists',
      example: `agent-scope explain flow ./flows/my-flow.json`,
    };
  }

  static invalidJson(filePath: string): DiagnosticError {
    return {
      type: 'invalid_json',
      message: `Invalid JSON in file: ${filePath}`,
      suggestion: 'Validate JSON syntax using a JSON validator',
      example: `Use jsonlint or similar tool to validate the file`,
    };
  }
}
