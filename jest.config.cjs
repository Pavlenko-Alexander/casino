 /* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  testEnvironment: 'jest-environment-jsdom',
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(config);
