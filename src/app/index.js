import YeomanGenerator from 'yeoman-generator';
import chalk from 'chalk';

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

  writing() {
    this.log('\n\n\n');
    this.log(`${chalk.underline.bold('Writing files to disk:')}\n`);
  }

  install() {
    this.log('\n\n\n');
    this.log(`${chalk.underline.bold('Installing:')}\n`);
  }

  end() {
    this.log('\n\n\n');
    this.log(`${chalk.underline.bold('Finishing:')}\n`);
  }
}
