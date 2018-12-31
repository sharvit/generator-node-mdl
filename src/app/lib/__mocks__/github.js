export const login = jest.fn(({ username, password }) => true);

export const createRepository = jest.fn(async ({ name, description }) => ({
  data: {
    name,
    description,
    ssh_url: 'some-ssh_url',
    html_url: 'some-html_url',
  },
}));

export const createGithubToken = jest.fn(async () => 'some-token');
