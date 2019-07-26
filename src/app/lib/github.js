import Octokit from '@octokit/rest';

export default class Github {
  /**
   * Github
   * @param {string}        username github username
   * @param {string}        password github password
   * @param {function}      on2fa    async function that should return
   *                                 two-factor authentication pin (string)
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

  async createToken(note, scopes) {
    const {
      data,
    } = await this.githubClient.oauthAuthorizations.createAuthorization({
      note,
      scopes,
    });

    return data.token;
  }
}
