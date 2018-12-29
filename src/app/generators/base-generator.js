const Generator = require('yeoman-generator');

const options = require('../options');

module.exports = class extends Generator {
  constructor(...args) {
    super(...args);

    for (const [name, value] of Object.entries(options)) {
      this.option(name, value);
    }
  }
};
