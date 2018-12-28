const npmProfile = require('npm-profile');

const login = ({ username, password }) =>
  npmProfile.loginCouch(username, password, {
    registry: 'https://registry.npmjs.org',
  });

module.exports = {
  login,
};
