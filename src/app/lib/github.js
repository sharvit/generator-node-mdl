import Octokit from '@octokit/rest';
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
    const {
      data,
    } = await this.githubClient.oauthAuthorizations.createAuthorization({
      note: `semantic-release-${repository}-${uuid().slice(-4)}`,
      scopes: [
        'repo',
        'read:org',
        'user:email',
        'repo_deployment',
        'repo:status',
        'write:repo_hook',
      ],
    });

    return data.token;
  }
}
