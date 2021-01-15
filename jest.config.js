module.exports = {
  preset: 'ts-jest',
  testEnvironment: require.resolve(`jest-environment-node`),
  collectCoverageFrom: ['services/*/src/**/*.ts', 'libs/*/src/**/*.ts'],
  reporters: [`default`, [require.resolve(`jest-junit`), {output: `<rootDir>/junit.xml`}]],
  testTimeout: 50000,
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.base.json',
    },
  }
}
