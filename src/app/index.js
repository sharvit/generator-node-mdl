import YeomanGenerator from 'yeoman-generator';

import './generators/project';
import './generators/github';
import './generators/travis';

import Prompter from './prompter';

export default class NodeMdlGenerator extends YeomanGenerator {
  constructor(...args) {
    super(...args);

    this.prompter = new Prompter(this);
  }

  async prompting() {
    this.props = await this.prompter.prompt();
  }

  configuring() {
    this.composeWith(require.resolve('./generators/project'), this.props);
    this.composeWith(require.resolve('./generators/github'), this.props);

    if (this.props.travisCI) {
      this.composeWith(require.resolve('./generators/travis'), this.props);
    }
  }
}
