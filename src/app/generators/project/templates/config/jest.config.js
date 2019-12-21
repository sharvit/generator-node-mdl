const path = require('path');

const projectRoot = path.resolve(__dirname, '../');

const config = {
  rootDir: projectRoot,
  roots: [path.resolve(projectRoot, './src')],
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
};

module.exports = config;
