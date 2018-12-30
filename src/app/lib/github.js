import createGithubClient from '@octokit/rest';

const github = createGithubClient();

export const login = ({ username, password }) =>
  github.authenticate({
    type: 'basic',
    username,
    password,
  });

export const createRepository = ({ name, description }) =>
  github.repos.createForAuthenticatedUser({ name, description });
