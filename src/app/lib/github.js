import Octokit from '@octokit/rest';
import request from 'request-promise';
import uuid from 'uuid/v4';

export default class Github {
  /**
   * Github
   * @param {string}   username github username
   * @param {string}   password github password
   * @param {function} on2fa    async function that should return
   *                            two-factor authentication pin (string)
   */
  constructor(username, password, on2fa) {
    this.username = username;
    this.password = password;

    this.githubClient = new Octokit({
      auth: {
        username,
        password,
        on2fa,
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
