export const authenticatedUserToken = 'some-token';
export const createAuthorization = jest
  .fn()
  .mockResolvedValue({ data: { token: authenticatedUserToken } });
export const createRepoForAuthenticatedUser = jest.fn();

const mock = jest.fn().mockImplementation(() => ({
  repos: { createForAuthenticatedUser: createRepoForAuthenticatedUser },
  oauthAuthorizations: { createAuthorization },
}));

export default mock;
