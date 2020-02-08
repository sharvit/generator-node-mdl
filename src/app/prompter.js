import camelCase from 'lodash.camelcase';
import kebabCase from 'lodash.kebabcase';
import chalk from 'chalk';
import uuid from 'uuid/v4';

import Github from './lib/github';
import { login as npmLogin } from './lib/npm';

import options from './options';
import prompts from './prompts';

export default class Prompter {
  constructor(generator) {
    this.generator = generator;

    this._setGeneratorOptions();
  }

  /**
   * Main prompter method
   */
  async prompt() {
    this._initProps();

    await this._promptGeneral();
    await this._promptEsdoc();
    await this._promptGithub();
    await this._promptTravis();
    await this._promptCoveralls();
    await this._promptNpm();
    await this._promptSemanticRelease();
    await this._promptPasswords();

    return this.props;
  }

  /*
    Sub prompters
   */

  async _promptGeneral() {
    const answers = await this.generator.prompt([
      this._buildPrompt('projectName', {
        ...prompts.projectName,
        default: kebabCase(this.generator.appname),
        filter: kebabCase,
      }),
      this._buildPrompt('description', prompts.description),
      this._buildPrompt('name', {
        ...prompts.name,
        default: this.generator.user.git.name(),
      }),
      this._buildPrompt('email', {
        ...prompts.email,
        default: this.generator.user.git.email(),
      }),
      this._buildPrompt('website', prompts.website),
    ]);

    this._updatePropsWithAnswers(answers);
    this.props.camelProject = camelCase(this.props.projectName);
  }

  async _promptEsdoc() {
    const { esdoc } = await this.generator.prompt([
      this._buildPrompt('esdoc', prompts.esdoc),
    ]);

    this._updatePropsWithAnswers({ esdoc: esdoc || false });
  }

  async _promptGithub() {
    const answers = await this.generator.prompt([
      this._buildPrompt('githubUsername', prompts.githubUsername),
      this._buildPrompt('githubTemplates', prompts.githubTemplates),
      this._buildPrompt(
        'createGithubRepository',
        prompts.createGithubRepository
      ),
    ]);

    this._updatePropsWithAnswers(answers);
    this.props.repository = `${this.props.githubUsername}/${this.props.projectName}`;
  }

  async _promptTravis() {
    const { travisCI } = await this.generator.prompt([
      this._buildPrompt('travisCI', prompts.travisCI),
    ]);

    this._updatePropsWithAnswers({ travisCI });
  }

  async _promptCoveralls() {
    const { coveralls } = await this.generator.prompt([
      this._buildPrompt('coveralls', prompts.coveralls),
    ]);

    this._updatePropsWithAnswers({ coveralls: coveralls || false });
  }

  async _promptNpm() {
    const { npmDeploy } = await this.generator.prompt([
      this._buildPrompt('npmDeploy', prompts.npmDeploy),
    ]);

    this._updatePropsWithAnswers({
      npmDeploy: npmDeploy || false,
    });
  }

  async _promptSemanticRelease() {
    const { semanticRelease } = await this.generator.prompt([
      this._buildPrompt('semanticRelease', prompts.semanticRelease),
    ]);

    this._updatePropsWithAnswers({
      semanticRelease: semanticRelease || false,
    });
  }

  async _promptPasswords() {
    const {
      createGithubRepository,
      npmDeploy,
      githubToken,
      npmToken,
      travisCI,
    } = this.props;

    if (createGithubRepository || travisCI) {
      if (!githubToken) {
        this._logGithubPasswordRequired();
        this._logPasswordSafety();
      }
      await this._loginToGithub();
    }

    if (!npmToken && npmDeploy) {
      this._logNpmPasswordRequired();
      this._logPasswordSafety();
      await this._loginToNpm();
    }
  }

  /*
    Login prompters
   */

  async _loginToNpm() {
    const { npmUsername, npmPassword } = await this._promptNpmLogin();

    // generate npm-token
    const { token: npmToken } = await npmLogin({
      username: npmUsername,
      password: npmPassword,
    });

    this.props = { ...this.props, npmToken };
  }

  async _loginToGithub() {
    const {
      githubToken: token,
      githubUsername: username,
      semanticRelease,
      repository,
    } = this.props;

    if (token) {
      this.props.github = new Github({ token });
      await this.props.github.authenticate();
      return;
    }

    const { githubPassword: password } = await this._promptGithubPassword();

    const note = `${repository}/travis-${uuid().slice(-4)}`;
    const noteUrl = 'https://github.com/sharvit/generator-node-mdl';
    const scopes = semanticRelease
      ? [
          'repo',
          'read:org',
          'user:email',
          'repo_deployment',
          'repo:status',
          'write:repo_hook',
        ]
      : [];

    this.props.github = new Github({
      username,
      password,
      note,
      noteUrl,
      scopes,
      on2Fa: (...args) => this.github2fa(...args),
    });
    this.props.githubToken = await this.props.github.authenticate();
  }

  _promptNpmLogin() {
    return this.generator.prompt([
      {
        name: 'npmUsername',
        message: 'Your npm username:',
        store: true,
      },
      {
        name: 'npmPassword',
        message: 'Your npm password:',
        type: 'password',
      },
    ]);
  }

  _promptGithubPassword() {
    const { githubUsername } = this.props;

    return this.generator.prompt([
      {
        name: 'githubPassword',
        message: `Enter you github password for ${githubUsername}:`,
        type: 'password',
      },
    ]);
  }

  _promptGithub2fa() {
    return this.generator.prompt([
      {
        name: 'github2fa',
        message: `Enter your github two-factor authentication Code:`,
        type: 'password',
      },
    ]);
  }

  async github2fa() {
    const { github2fa } = await this._promptGithub2fa();

    return github2fa;
  }

  /*
    Loggers
   */

  _logGithubPasswordRequired() {
    const { createGithubRepository } = this.props;

    if (createGithubRepository) {
      this.generator.log(
        '\nYour github password is required so I can create a github repository for you.'
      );
    } else {
      this.generator.log(
        '\nYour github password is required so I can install semantic-release for you.'
      );
    }
  }

  _logNpmPasswordRequired() {
    this.generator.log(
      '\nYour npm username and password is required so I can install an automated npm-deploy for you.'
    );
  }

  _logPasswordSafety() {
    this.generator.log(
      `${chalk.bold('I will never store your passwords')} 🙌 🙌 🙌 \n`
    );
  }

  /*
    Helpers
   */

  _setGeneratorOptions() {
    for (const [name, { type, desc }] of Object.entries(options)) {
      this.generator.option(name, { type, desc });
    }
  }

  _initProps() {
    this.props = {};

    for (const optionName of Object.keys(options)) {
      const { [optionName]: option } = this.generator.options;

      if (option) {
        this.props[optionName] = option;
      }
    }
  }

  _updatePropsWithAnswers(answers) {
    for (const [name, value] of Object.entries(answers)) {
      if (value) {
        this.props[name] = value;
      }
    }
  }

  _buildPrompt(name, prompt) {
    const result = { name, message: prompt.desc };

    if (prompt.default) result.default = prompt.default;
    if (prompt.store) result.store = prompt.store;
    if (prompt.filter) result.filter = prompt.filter;

    switch (prompt.type) {
      case Boolean:
        result.type = 'confirm';
        result.default = this.props.noDefaults ? false : result.default;
        break;
      case String:
      default:
        result.type = 'input';
        break;
    }

    result.when = () => {
      if (this.props[name] !== undefined) return false;
      if (this.props.noDefaults && prompt.type === Boolean) return false;

      if (prompts[name].dependOn) {
        for (const dependOn of prompts[name].dependOn) {
          if (!this.props[dependOn]) {
            return false;
          }
        }
      }

      prompts[name].help && this.generator.log(prompts[name].help());
      return true;
    };

    if (prompt.required) {
      result.validate = input => {
        if (
          input === undefined ||
          (typeof input === 'string' &&
            input.trim() === '' &&
            prompt.default === undefined)
        ) {
          throw new Error(`${name} is required`);
        }

        return true;
      };
    }

    return result;
  }
}
