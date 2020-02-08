export const authenticatedUserToken = 'some-token';
export const auth = jest
  .fn()
  .mockResolvedValue({ token: authenticatedUserToken });

export const createRepoForAuthenticatedUser = jest.fn();

export const Octokit = jest.fn().mockImplementation(() => ({
  auth,
  repos: { createForAuthenticatedUser: createRepoForAuthenticatedUser },
}));
