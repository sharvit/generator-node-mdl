import Octokit, {
  createRepoForAuthenticatedUser,
  createAuthorization,
  authenticatedUserToken,
} from '@octokit/rest';
import Github from './github';

describe('Github', () => {
  let github;
  const username = 'some-username';
  const password = 'some-password';
  const on2fa = jest.fn();

  beforeEach(() => {
    Octokit.mockClear();
    createRepoForAuthenticatedUser.mockClear();
    createAuthorization.mockClear();

    github = new Github({ username, password, on2fa });
  });

  it('should create a new Github instance', () => {
    expect(Octokit).toBeCalledWith({
      auth: {
        username,
        password,
        on2fa,
      },
    });
  });

  it('should create-repository', () => {
    const name = 'some-name';
    const description = 'some-description';

    github.createRepository({ name, description });

    expect(createRepoForAuthenticatedUser).toBeCalledWith({
      name,
      description,
    });
  });

  it('should create-createToken', async () => {
    const note = 'some-note';
    const scopes = 'some-scopes';

    const token = await github.createToken(note, scopes);

    expect(token).toBe(authenticatedUserToken);
    expect(createAuthorization).toBeCalledWith({
      note,
      scopes,
    });
  });
});
