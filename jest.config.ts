/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  transform: { '\\.[jt]s?$': ['ts-jest', { tsconfig: { allowJs: true } }] },  // allowJs is required for get-port
  transformIgnorePatterns: ['node_modules/(?!get-port/.*)'],  // you might need to ignore some packages
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.[jt]s$': '$1',
  },
};