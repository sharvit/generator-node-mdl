const login = jest.fn(({ username, password }) => true);

const authenticate = jest.fn(token => ({ token }));

const createRepository = jest.fn(async ({ name, description }) => ({
  data: {
    name,
    description,
    ssh_url: 'some-ssh_url',
    html_url: 'some-html_url',
  },
}));

module.exports = {
  login,
  authenticate,
  createRepository,
};
