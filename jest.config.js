const base = require('./jest.config.base.js');

module.exports = {
  ...base,
  projects: ['<rootDir>/services/*/jest.config.js', '<rootDir>/commons/*/jest.config.js'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
};
