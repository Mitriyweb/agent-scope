import type { Command } from '@/types/Command';
import { RoleRegistry } from '@/roles/RoleRegistry';

export class RoleListCommand implements Command {
  name = 'role list';
  description = 'List available roles';

  async execute(): Promise<void> {
    const registry = new RoleRegistry();
    const roles = registry.listRoles();

    console.log('\nAvailable Roles:');
    for (const role of roles) {
      const type = role.isBuiltIn ? '(built-in)' : '(custom)';
      console.log(`  ${role.name} ${type}`);
      console.log(`    ${role.description}`);
    }
  }
}
