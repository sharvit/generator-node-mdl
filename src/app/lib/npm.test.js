import npmProfile from 'npm-profile';
import { login } from './npm';

describe('npm', () => {
  it('should login', () => {
    const username = 'some-username';
    const password = 'some-password';

    login({ username, password });

    expect(npmProfile.loginCouch).toBeCalledWith(username, password, {
      registry: 'https://registry.npmjs.org',
    });
  });
});
