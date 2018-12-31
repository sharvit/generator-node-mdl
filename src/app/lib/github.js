import createGithubClient from '@octokit/rest';
import request from 'request-promise';
import uuid from 'uuid/v4';

const github = createGithubClient();

export const login = ({ username, password }) =>
  github.authenticate({
    type: 'basic',
    username,
    password,
  });

export const createRepository = ({ name, description }) =>
  github.repos.createForAuthenticatedUser({ name, description });

export const createGithubToken = async ({
  username,
  password,
  repository,
  scopes,
}) => {
  const { token } = await request({
    method: 'POST',
    url: 'https://api.github.com/authorizations',
    json: true,
    auth: { username, password },
    headers: {
      'User-Agent': 'semantic-release',
    },
    body: {
      scopes,
      note: `semantic-release-${repository}-${uuid().slice(-4)}`,
    },
  });

  return token;
};
