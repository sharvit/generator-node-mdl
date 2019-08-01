const Github = jest.fn(function({ on2fa }) {
  this._on2fa = function() {
    if (Github.use2fa && !this._on2faCalled) {
      this._on2faCalled = true;
      return on2fa();
    }
  };
});

Github.use2fa = false;

Github.prototype.createRepository = jest.fn(async function() {
  await this._on2fa();

  return {
    data: { html_url: 'some-html-url' },
  };
});

Github.prototype.createToken = jest.fn(async function(repository) {
  await this._on2fa();

  return 'some-token';
});

export default Github;
