export const login = ({ username, password }) =>
  jest.fn(() => ({ token: 'some-token' }));
