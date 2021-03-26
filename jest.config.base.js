module.exports = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  testEnvironment: require.resolve(`jest-environment-node`),
  collectCoverageFrom: ['services/*/src/**/*.ts', 'commons/*/src/**/*.ts'],
  reporters: [`default`, [require.resolve(`jest-junit`), {output: `<rootDir>/junit.xml`}]],
  testTimeout: 50000,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coveragePathIgnorePatterns: ['(.*.mock).(|ts?|tsx?)$'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.base.json',
    },
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.tsx$': 'ts-jest',
  },
}
