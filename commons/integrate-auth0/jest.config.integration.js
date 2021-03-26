require('dotenv').config();
module.exports = Object.assign({}, require('../../jest.config.base.js'), {
  modulePathIgnorePatterns: [],
  moduleFileExtensions: ["ts", "js", "json"],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  testRegex: "\\.integration\\.ts$",
  modulePathIgnorePatterns: ['dist']
});
