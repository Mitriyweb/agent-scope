import { Command } from 'commander';
import { EnvironmentSetup, EnvironmentPrompts } from '../environment/index.js';

export class EnvCommand {
  static register(program: Command) {
    const envCommand = program
      .command('env')
      .description('Manage development environment configurations');

    envCommand
      .command('update')
      .description('Update development environment configurations')
      .action(async () => {
        try {
          console.log('🔄 Updating development environment configurations...');

          const projectPath = process.cwd();
          const result = await EnvironmentSetup.updateEnvironment(projectPath);

          EnvironmentPrompts.showResults(result);

          if (result.success) {
            console.log('\n✅ Environment update complete!');
          } else {
            console.log('\n❌ Environment update completed with errors.');
            process.exit(1);
          }
        } catch (error) {
          console.error('Environment update failed:', error);
          process.exit(1);
        }
      });

    envCommand
      .command('setup')
      .description('Set up development environment from scratch')
      .action(async () => {
        try {
          console.log('🚀 Setting up development environment...');

          const projectPath = process.cwd();
          const options = EnvironmentSetup.getAvailableOptions();

          const selection = await EnvironmentPrompts.promptForEnvironmentSelection(
            options.ides,
            options.aiTools
          );

          if (selection) {
            const result = await EnvironmentSetup.setupEnvironment(projectPath, selection);
            EnvironmentPrompts.showResults(result);

            if (result.success) {
              console.log('\n✅ Environment setup complete!');
            } else {
              console.log('\n❌ Environment setup completed with errors.');
              process.exit(1);
            }
          } else {
            console.log('Environment setup cancelled.');
          }
        } catch (error) {
          console.error('Environment setup failed:', error);
          process.exit(1);
        }
      });

    envCommand
      .command('status')
      .description('Show current development environment status')
      .action(() => {
        try {
          console.log('📊 Development Environment Status');

          const projectPath = process.cwd();
          const existing = EnvironmentSetup.detectExisting(projectPath);
          const options = EnvironmentSetup.getAvailableOptions();

          console.log('\nConfigured IDEs:');
          if (existing.ides.length > 0) {
            existing.ides.forEach(ideId => {
              const ide = options.ides.find(i => i.id === ideId);
              console.log(`  ✓ ${ide?.name ?? ideId}`);
            });
          } else {
            console.log('  No IDEs configured');
          }

          console.log('\nConfigured AI Tools:');
          if (existing.aiTools.length > 0) {
            existing.aiTools.forEach(toolId => {
              const tool = options.aiTools.find(t => t.id === toolId);
              console.log(`  ✓ ${tool?.name ?? toolId}`);
            });
          } else {
            console.log('  No AI tools configured');
          }

          console.log('\nAvailable IDEs:');
          options.ides.forEach(ide => {
            const configured = existing.ides.includes(ide.id) ? '✓' : ' ';
            console.log(`  [${configured}] ${ide.name} - ${ide.description}`);
          });

          console.log('\nAvailable AI Tools:');
          options.aiTools.forEach(tool => {
            const configured = existing.aiTools.includes(tool.id) ? '✓' : ' ';
            console.log(`  [${configured}] ${tool.name} - ${tool.description}`);
          });

          console.log('\nCommands:');
          console.log('  agent-scope env setup  - Configure new environment');
          console.log('  agent-scope env update - Update existing configurations');
        } catch (error) {
          console.error('Failed to get environment status:', error);
          process.exit(1);
        }
      });
  }
}
