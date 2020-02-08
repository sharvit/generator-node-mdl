import {
  Octokit,
  auth,
  createRepoForAuthenticatedUser,
  authenticatedUserToken,
} from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';
import { createBasicAuth } from '@octokit/auth-basic';
import Github from './github';

describe('Github', () => {
  beforeEach(() => {
    Octokit.mockClear();
    auth.mockClear();
    createRepoForAuthenticatedUser.mockClear();
  });

  it('should create a new Github instance with token', () => {
    new Github({ token: authenticatedUserToken }); // eslint-disable-line no-new

    expect(Octokit).toBeCalledWith({
      auth: authenticatedUserToken,
      authStrategy: createTokenAuth,
    });
  });

  it('should create a new Github instance with basic auth', () => {
    const username = 'some-username';
    const password = 'some-password';
    const on2Fa = jest.fn();
    const note = 'some note';
    const noteUrl = 'some-note-url';
    const scopes = ['some', 'scopes'];

    new Github({ username, password, on2Fa, note, noteUrl, scopes }); // eslint-disable-line no-new

    expect(Octokit).toBeCalledWith({
      auth: {
        username,
        password,
        on2Fa,
        token: { note, scopes, noteUrl },
      },
      authStrategy: createBasicAuth,
    });
  });

  it('should create-repository', () => {
    const name = 'some-name';
    const description = 'some-description';
    const github = new Github({ token: authenticatedUserToken });

    github.createRepository({ name, description });

    expect(createRepoForAuthenticatedUser).toBeCalledWith({
      name,
      description,
    });
  });

  it('should authenticate', async () => {
    const github = new Github({ token: authenticatedUserToken });
    const token = await github.authenticate();

    expect(token).toBe(authenticatedUserToken);
    expect(auth).toBeCalled();
  });
});
