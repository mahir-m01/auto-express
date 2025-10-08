/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Tests can be slow because they scaffold a new project
  testTimeout: 30000,
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
};
