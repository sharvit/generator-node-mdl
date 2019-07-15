import Octokit from '@octokit/rest';
import request from 'request-promise';
import uuid from 'uuid/v4';

export default class Github {
  constructor(username, password) {
    this.username = username;
    this.password = password;

    this.githubClient = new Octokit({
      auth: {
        username,
        password,
      },
    });
  }

  createRepository({ name, description }) {
    return this.githubClient.repos.createForAuthenticatedUser({
      name,
      description,
    });
  }

  async createToken(repository) {
    const { username, password } = this;

    const { token } = await request({
      method: 'POST',
      url: 'https://api.github.com/authorizations',
      json: true,
      auth: { username, password },
      headers: {
        'User-Agent': 'semantic-release',
      },
      body: {
        scopes: [
          'repo',
          'read:org',
          'user:email',
          'repo_deployment',
          'repo:status',
          'write:repo_hook',
        ],
        note: `semantic-release-${repository}-${uuid().slice(-4)}`,
      },
    });

    return token;
  }
}
