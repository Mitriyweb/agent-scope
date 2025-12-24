import * as fs from 'fs';
import * as path from 'path';

export function getVersion(): string {
  const packageJsonPath = path.join(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}
