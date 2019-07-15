const Github = jest.fn();

Github.prototype.createRepository = jest.fn(({ name, description }) =>
  Promise.resolve({
    data: { html_url: 'some-html-url' },
  })
);

Github.prototype.createToken = jest.fn(repository =>
  Promise.resolve('some-token')
);

export default Github;
