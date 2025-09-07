/**
 * Jest configuration for testing GitHub Actions workflow and deployment logic
 */

module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'tests/**/*.js',
    '!tests/**/*.test.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
  moduleFileExtensions: ['js', 'json'],
  transform: {},
  globals: {
    'process.env': {
      NODE_ENV: 'test',
      BUILD_DIR: 'dist',
      CLOUDFLARE_API_TOKEN: 'mock-token',
      CLOUDFLARE_ACCOUNT_ID: 'mock-account-id'
    }
  }
};
