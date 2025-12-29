import { SpecifyCommand } from '@/commands/SpecifyCommand';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

describe('SpecifyCommand', () => {
  let program: Command;
  const testDir = path.join(__dirname, 'test-specify');
  const originalCwd = process.cwd();

  beforeEach(() => {
    program = new Command();
    SpecifyCommand.register(program);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(path.join(testDir, 'specs'), { recursive: true });
    // Create a template file for testing
    fs.writeFileSync(
      path.join(testDir, 'specs', 'template.md'),
      '# Capability: [Name]\nRequirements...'
    );
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should create a new specification from template', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    program.parse(['node', 'test', 'specify', 'MyFeature']);

    expect(fs.existsSync(path.join(testDir, 'specs', 'MyFeature.md'))).toBe(true);
    const content = fs.readFileSync(path.join(testDir, 'specs', 'MyFeature.md'), 'utf-8');
    expect(content).toContain('# Capability: MyFeature');
    expect(logSpy).toHaveBeenCalledWith('Created specification: specs/MyFeature.md');

    logSpy.mockRestore();
  });

  it('should list specifications', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.writeFileSync(path.join(testDir, 'specs', 'FeatureA.md'), 'content');
    fs.writeFileSync(path.join(testDir, 'specs', 'FeatureB.md'), 'content');

    program.parse(['node', 'test', 'specify', 'list']);

    expect(logSpy).toHaveBeenCalledWith('Specifications:');
    expect(logSpy).toHaveBeenCalledWith('- FeatureA');
    expect(logSpy).toHaveBeenCalledWith('- FeatureB');

    logSpy.mockRestore();
  });

  it('should fail if specification already exists', () => {
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: string | number | null | undefined): never => {
        throw new Error(`process.exit: ${code}`);
      });
    fs.writeFileSync(path.join(testDir, 'specs', 'Existing.md'), 'content');

    expect(() => {
      program.parse(['node', 'test', 'specify', 'Existing']);
    }).toThrow('process.exit: 1');

    exitSpy.mockRestore();
  });

  it('should handle missing specs directory for list', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.rmSync(path.join(testDir, 'specs'), { recursive: true });

    program.parse(['node', 'test', 'specify']);

    expect(logSpy).toHaveBeenCalledWith('No specs/ directory found.');
    logSpy.mockRestore();
  });

  it('should handle empty specs directory for list', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.rmSync(path.join(testDir, 'specs', 'template.md'));

    program.parse(['node', 'test', 'specify']);

    expect(logSpy).toHaveBeenCalledWith('No specifications found.');
    logSpy.mockRestore();
  });

  it('should list specifications via list command', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.writeFileSync(path.join(testDir, 'specs', 'FeatureA.md'), 'content');

    program.parse(['node', 'test', 'specify', 'list']);

    expect(logSpy).toHaveBeenCalledWith('Specifications:');
    expect(logSpy).toHaveBeenCalledWith('- FeatureA');
    logSpy.mockRestore();
  });

  it('should fail if template is missing', () => {
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: string | number | null | undefined): never => {
        throw new Error(`process.exit: ${code}`);
      });
    fs.rmSync(path.join(testDir, 'specs', 'template.md'));

    expect(() => {
      program.parse(['node', 'test', 'specify', 'NewFeature']);
    }).toThrow('process.exit: 1');

    exitSpy.mockRestore();
  });

  describe('validate', () => {
    it('should validate a correct specification', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const specContent = `
### Requirement: Authentication
The system SHALL support user login.
#### Scenario: Successful Login
Given a user...
`;
      fs.writeFileSync(path.join(testDir, 'specs', 'ValidSpec.md'), specContent);

      program.parse(['node', 'test', 'specify', 'validate', 'ValidSpec']);

      expect(logSpy).toHaveBeenCalledWith('✅ Specification ValidSpec is valid.');
      logSpy.mockRestore();
    });

    it('should fail if SHALL/MUST is missing', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation((code?: string | number | null | undefined): never => {
          throw new Error(`process.exit: ${code}`);
        });
      const specContent = `
### Requirement: Authentication
The system does something.
#### Scenario: Successful Login
`;
      fs.writeFileSync(path.join(testDir, 'specs', 'InvalidSpec.md'), specContent);

      expect(() => {
        program.parse(['node', 'test', 'specify', 'validate', 'InvalidSpec']);
      }).toThrow('process.exit: 1');

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('missing SHALL/MUST statement')
      );

      errorSpy.mockRestore();
      exitSpy.mockRestore();
    });

    it('should fail if Scenario is missing', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation((code?: string | number | null | undefined): never => {
          throw new Error(`process.exit: ${code}`);
        });
      const specContent = `
### Requirement: Authentication
The system SHALL support login.
`;
      fs.writeFileSync(path.join(testDir, 'specs', 'NoScenario.md'), specContent);

      expect(() => {
        program.parse(['node', 'test', 'specify', 'validate', 'NoScenario']);
      }).toThrow('process.exit: 1');

      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('missing "#### Scenario:"'));

      errorSpy.mockRestore();
      exitSpy.mockRestore();
    });

    it('should validate all specifications', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const spec1 = '### Requirement: R1\nSHALL do X\n#### Scenario: S1';
      const spec2 = '### Requirement: R2\nMUST do Y\n#### Scenario: S2';

      fs.writeFileSync(path.join(testDir, 'specs', 'Spec1.md'), spec1);
      fs.writeFileSync(path.join(testDir, 'specs', 'Spec2.md'), spec2);

      program.parse(['node', 'test', 'specify', 'validate']);

      expect(logSpy).toHaveBeenCalledWith('Validating all specifications...');
      expect(logSpy).toHaveBeenCalledWith('✅ All specifications passed validation.');
      logSpy.mockRestore();
    });

    it('should fail if one of many specifications is invalid', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation((code?: string | number | null | undefined): never => {
          throw new Error(`process.exit: ${code}`);
        });
      const validSpec = '### Requirement: R1\nSHALL do X\n#### Scenario: S1';
      const invalidSpec = '### Requirement: R2\nNo statement\n#### Scenario: S2';

      fs.writeFileSync(path.join(testDir, 'specs', 'Valid.md'), validSpec);
      fs.writeFileSync(path.join(testDir, 'specs', 'Invalid.md'), invalidSpec);

      expect(() => {
        program.parse(['node', 'test', 'specify', 'validate']);
      }).toThrow('process.exit: 1');

      expect(errorSpy).toHaveBeenCalledWith('❌ Some specifications failed validation.');

      errorSpy.mockRestore();
      exitSpy.mockRestore();
    });

    it('should warn if no requirements found', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      fs.writeFileSync(path.join(testDir, 'specs', 'Empty.md'), 'just text');

      program.parse(['node', 'test', 'specify', 'validate', 'Empty']);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Warning: No requirements found.')
      );
      logSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it('should validate multiple requirements in one file', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const specContent = `
### Requirement: Req1
It SHALL work.
#### Scenario: S1

### Requirement: Req2
It MUST work.
#### Scenario: S2
`;
      fs.writeFileSync(path.join(testDir, 'specs', 'MultiReq.md'), specContent);

      program.parse(['node', 'test', 'specify', 'validate', 'MultiReq']);

      expect(logSpy).toHaveBeenCalledWith('✅ Specification MultiReq is valid.');
      logSpy.mockRestore();
    });

    it('should fail if any requirement in a multi-req file is invalid', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation((code?: string | number | null | undefined): never => {
          throw new Error(`process.exit: ${code}`);
        });
      const specContent = `
### Requirement: Req1
It SHALL work.
#### Scenario: S1

### Requirement: Req2
This requirement is missing normative language.
#### Scenario: S2
`;
      fs.writeFileSync(path.join(testDir, 'specs', 'MultiReqInvalid.md'), specContent);

      expect(() => {
        program.parse(['node', 'test', 'specify', 'validate', 'MultiReqInvalid']);
      }).toThrow('process.exit: 1');

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('missing SHALL/MUST statement')
      );

      errorSpy.mockRestore();
      exitSpy.mockRestore();
    });

    it('should fail if specific spec not found', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation((code?: string | number | null | undefined): never => {
          throw new Error(`process.exit: ${code}`);
        });

      expect(() => {
        program.parse(['node', 'test', 'specify', 'validate', 'NonExistent']);
      }).toThrow('process.exit: 1');

      expect(errorSpy).toHaveBeenCalledWith('Specification NonExistent not found.');

      errorSpy.mockRestore();
      exitSpy.mockRestore();
    });
  });
});
