# Tasks: Add Build System

## 1. Build Command Implementation

- [x] 1.1 Create `BuildCommand` class in `src/commands/BuildCommand.ts`
- [x] 1.2 Implement build configuration loader (reads `agent-scope.build.json`)
- [x] 1.3 Add agent compilation logic
- [x] 1.4 Add flow compilation logic
- [x] 1.5 Implement output format handlers (JSON, archive)
- [x] 1.6 Write comprehensive tests for BuildCommand
- [x] 1.7 Add build command to CLI routing

## 2. Validate Command Implementation

- [x] 2.1 Create `ValidateCommand` class in `src/commands/ValidateCommand.ts`
- [x] 2.2 Implement build artifact validation
- [x] 2.3 Add schema validation for compiled artifacts
- [x] 2.4 Implement dependency validation
- [x] 2.5 Write comprehensive tests for ValidateCommand
- [x] 2.6 Add validate command to CLI routing

## 3. Build Configuration System

- [x] 3.1 Create build configuration schema
- [x] 3.2 Implement configuration loader and parser
- [x] 3.3 Add support for `agent-scope.build.json` files
- [x] 3.4 Write configuration validation tests
- [x] 3.5 Document configuration format

## 4. Build Artifacts and Output

- [x] 4.1 Define build artifact structure
- [x] 4.2 Implement JSON output format
- [x] 4.3 Implement archive (tar.gz) output format
- [x] 4.4 Add metadata generation (version, timestamp, checksums)
- [x] 4.5 Write artifact generation tests

## 5. Release Process

- [x] 5.1 Create npm package structure
- [x] 5.2 Add build scripts to `package.json`
- [x] 5.3 Implement version management
- [x] 5.4 Add release documentation
- [x] 5.5 Write release process tests

## 6. NPM CLI Tool Build Integration

- [x] 6.1 Create code for building this app as npm CLI tool
- [x] 6.2 Add build script to `package.json` for CLI distribution
- [x] 6.3 Configure npm package metadata for CLI tool
- [x] 6.4 Test CLI tool installation and execution
- [x] 6.5 Document CLI tool usage and installation

## 7. Documentation and Integration

- [x] 7.1 Update CLI help text for build commands
- [x] 7.2 Add build system documentation to README
- [x] 7.3 Create build configuration examples
- [x] 7.4 Update ROADMAP to mark phase complete
- [x] 7.5 Run full test suite and verify coverage
