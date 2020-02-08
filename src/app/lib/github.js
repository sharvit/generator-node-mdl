import { Octokit } from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';
import { createBasicAuth } from '@octokit/auth-basic';

/**
 * Github class
 */
export default class Github {
  /**
   * Create a Github instance
   * @param {string}   token    Set token to login with auth-token
   * @param {string}   username Set username to login with username and password
   * @param {string}   password Set password to login with username and password
   * @param {Function} on2Fa    Set on2Fa to support 2 factor authentication
   * @param {string}   note     Note description for the new token
   * @param {string}   noteUrl  Note url for the new token
   * @param {string[]} scopes   Auth token scopes
   */
  constructor({ token, username, password, on2Fa, note, noteUrl, scopes }) {
    const authStrategy = token ? createTokenAuth : createBasicAuth;
    const auth = token || {
      username,
      password,
      on2Fa,
      token: { note, scopes, noteUrl },
    };

    this.githubClient = new Octokit({
      auth,
      authStrategy,
    });
  }

  async authenticate() {
    const { token } = await this.githubClient.auth();

    return token;
  }

  createRepository({ name, description }) {
    return this.githubClient.repos.createForAuthenticatedUser({
      name,
      description,
    });
  }
}
