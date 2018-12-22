const github = require('@octokit/rest')();

const login = ({ username, password }) =>
  github.authenticate({
    type: 'basic',
    username,
    password,
  });

const authenticate = token =>
  github.authenticate({
    type: 'token',
    token,
  });

const createRepository = ({ name, description }) =>
  github.repos.createForAuthenticatedUser({ name, description });

module.exports = {
  login,
  authenticate,
  createRepository,
};
