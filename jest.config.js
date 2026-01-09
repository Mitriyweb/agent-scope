module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/app/$1',
  },
  collectCoverageFrom: ['src/app/**/*.ts', '!src/app/index.ts'],
  coverageThreshold: {
    global: {
      branches: 44,
      functions: 56,
      lines: 53,
      statements: 53,
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
};
