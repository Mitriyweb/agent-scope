## ADDED Requirements

### Requirement: Build Command

The system SHALL provide a `build` command that compiles agents and flows into distributable artifacts.

#### Scenario: Build with default configuration

- **WHEN** user runs `agent-scope build` in a directory with `agent-scope.build.json`
- **THEN** the system compiles all agents and flows and outputs artifacts to `dist/` directory

#### Scenario: Build with custom output format

- **WHEN** user runs `agent-scope build --format archive`
- **THEN** the system creates a tar.gz archive containing all compiled artifacts

#### Scenario: Build with specific target

- **WHEN** user runs `agent-scope build --target agents`
- **THEN** the system compiles only agents and skips flows

### Requirement: Validate Command

The system SHALL provide a `validate` command that verifies build artifacts for correctness and completeness.

#### Scenario: Validate build artifacts

- **WHEN** user runs `agent-scope validate dist/`
- **THEN** the system checks artifact integrity, schema compliance, and reports any issues

#### Scenario: Validate with detailed output

- **WHEN** user runs `agent-scope validate --verbose`
- **THEN** the system provides detailed validation results including checksums and metadata

### Requirement: Build Configuration

The system SHALL support build configuration via `agent-scope.build.json` file.

#### Scenario: Load build configuration

- **WHEN** `agent-scope.build.json` exists in the project root
- **THEN** the build command reads and applies the configuration

#### Scenario: Invalid configuration schema

- **WHEN** `agent-scope.build.json` contains invalid schema
- **THEN** the system reports validation errors with helpful messages

### Requirement: Build Artifacts

The system SHALL generate build artifacts in standardized formats with metadata.

#### Scenario: JSON artifact format

- **WHEN** build completes successfully
- **THEN** agents and flows are output as individual JSON files in `dist/agents/` and `dist/flows/`

#### Scenario: Archive artifact format

- **WHEN** user specifies archive format
- **THEN** all artifacts are packaged into a tar.gz file with metadata.json

#### Scenario: Artifact metadata

- **WHEN** artifacts are generated
- **THEN** metadata.json includes version, timestamp, checksums, and file manifest

### Requirement: Build Validation

The system SHALL validate artifacts at multiple stages during the build process.

#### Scenario: Configuration validation

- **WHEN** build starts
- **THEN** configuration schema is validated before compilation begins

#### Scenario: Compilation validation

- **WHEN** agents and flows are compiled
- **THEN** syntax and references are validated and errors are reported

#### Scenario: Artifact validation

- **WHEN** artifacts are generated
- **THEN** integrity and completeness are verified before output

### Requirement: Error Handling and Diagnostics

The system SHALL provide clear error messages and recovery suggestions.

#### Scenario: Missing configuration file

- **WHEN** `agent-scope.build.json` is not found
- **THEN** the system reports the error and suggests creating a configuration file

#### Scenario: Compilation error

- **WHEN** an agent or flow has syntax errors
- **THEN** the system reports the error with file location and suggestions for fixing

#### Scenario: Validation failure

- **WHEN** artifact validation fails
- **THEN** the system reports what failed and how to resolve it
