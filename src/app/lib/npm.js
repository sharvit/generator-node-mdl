import npmProfile from 'npm-profile';

export const login = ({ username, password }) =>
  npmProfile.loginCouch(username, password, {
    registry: 'https://registry.npmjs.org',
  });
