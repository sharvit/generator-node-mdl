import YeomanGenerator from 'yeoman-generator';
import options from '../options';

export default class extends YeomanGenerator {
  constructor(...args) {
    super(...args);

    for (const [name, value] of Object.entries(options)) {
      this.option(name, value);
    }
  }
}
