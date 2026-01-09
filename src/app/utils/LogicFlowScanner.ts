import { readFileSync } from 'fs';

export interface LogicFlowIssue {
  line: number;
  content: string;
  type: 'code_detected' | 'invalid_syntax';
  message: string;
}

export class LogicFlowScanner {
  private static readonly CODE_SYMBOLS = ['{', '}', ';', '=>', '===', '&&', '||'];

  /**
   * Scans a file or string for Logic Flow compliance.
   * Logic Flow sections are expected to be in "Section B" or "Section C" of the Markdown file.
   */
  public static scan(content: string): LogicFlowIssue[] {
    const issues: LogicFlowIssue[] = [];
    const lines = content.split('\n');
    let isInLogicSection = false;
    let isInCodeBlock = false;

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const strippedLine = line.trim();

      // Detect start/end of code blocks
      if (strippedLine.startsWith('```')) {
        isInCodeBlock = !isInCodeBlock;
        if (isInCodeBlock && isInLogicSection) {
          issues.push({
            line: lineNumber,
            content: strippedLine,
            type: 'code_detected',
            message: 'Code block detected within Logic Flow section.',
          });
        }
        return;
      }

      // Detect logic sections (Section B and Section C)
      if (strippedLine.startsWith('## Section B') || strippedLine.startsWith('## Section C')) {
        isInLogicSection = true;
      } else if (strippedLine.startsWith('## Section')) {
        isInLogicSection = false;
      }

      if (isInLogicSection && !isInCodeBlock) {
        // Check for code symbols
        for (const symbol of this.CODE_SYMBOLS) {
          if (strippedLine.includes(symbol)) {
            issues.push({
              line: lineNumber,
              content: strippedLine,
              type: 'code_detected',
              message: `Suspicious symbol '${symbol}' detected in Logic Flow section.`,
            });
            break;
          }
        }

        // Check for inline code
        if (strippedLine.includes('`')) {
          issues.push({
            line: lineNumber,
            content: strippedLine,
            type: 'code_detected',
            message: 'Inline code detected in Logic Flow section.',
          });
        }
      }
    });

    return issues;
  }

  /**
   * Scans a file by path.
   */
  public static scanFile(filePath: string): LogicFlowIssue[] {
    try {
      const content = readFileSync(filePath, 'utf-8');
      return this.scan(content);
    } catch (error) {
      throw new Error(`Failed to read file: ${filePath}`);
    }
  }
}
