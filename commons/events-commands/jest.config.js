module.exports = Object.assign({}, require(`../../jest.config.js`), {
  modulePathIgnorePatterns: [],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  }
});
