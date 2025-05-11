/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  rootDir: './test',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts}'],
  setupFilesAfterEnv: ['<rootDir>/helper.ts'],
};
