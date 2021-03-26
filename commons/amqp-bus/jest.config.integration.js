module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: [
    "<rootDir>/test/setup.ts"
  ],
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\](?!node-ts.+).+\\.ts$"
  ],
  testRegex: "(src\\/.+\\.|/)(integration|spec)\\.ts$",
  testEnvironment: "node",
  bail: true,
  modulePathIgnorePatterns: ['dist'],
  verbose: false
}
