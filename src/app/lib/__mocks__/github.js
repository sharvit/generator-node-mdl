const Github = jest.fn(function({ on2Fa }) {
  this._on2Fa = () => {
    if (Github.use2fa && !this._on2FaCalled) {
      this._on2FaCalled = true;
      return on2Fa();
    }
  };
});

Github.use2fa = false;

Github.prototype.createRepository = jest.fn(async function() {
  await this._on2Fa();

  return {
    data: { html_url: 'some-html-url' },
  };
});

Github.prototype.authenticate = jest.fn(async function() {
  await this._on2Fa();

  return 'some-token';
});

export default Github;
