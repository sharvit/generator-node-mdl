import camelCase from 'lodash.camelcase';
import kebabCase from 'lodash.kebabcase';
import chalk from 'chalk';

import Github from './lib/github';
import { login as npmLogin } from './lib/npm';

import options from './options';

export default class Prompter {
  constructor(generator) {
    this.generator = generator;
  }

  /**
   * Main prompter method
   */
  async prompt() {
    this.props = {};

    await this._promptGeneral();
    await this._promptGithub();
    await this._promptTravis();
    await this._promptNpm();
    await this._promptPasswords();

    return this.props;
  }

  /*
    Sub prompters
   */

  async _promptGeneral() {
    const answers = await this.generator.prompt([
      {
        name: 'projectName',
        message: options.projectName.desc,
        default: kebabCase(this.generator.appname),
        filter: kebabCase,
      },
      {
        name: 'description',
        message: options.description.desc,
        default: options.description.default,
        store: true,
      },
      {
        name: 'name',
        message: options.name.desc,
        default: this.generator.user.git.name(),
      },
      {
        name: 'email',
        message: options.email.desc,
        default: this.generator.user.git.email(),
      },
      {
        name: 'website',
        message: options.website.desc,
        store: true,
      },
    ]);

    Object.assign(this.props, answers, {
      camelProject: camelCase(answers.projectName),
    });
  }

  async _promptGithub() {
    const answers = await this.generator.prompt([
      {
        name: 'githubUsername',
        message: options.githubUsername.desc,
        store: true,
      },
      {
        name: 'githubTemplates',
        message: options.githubTemplates.desc,
        type: 'confirm',
        default: true,
      },
      {
        name: 'createGithubRepository',
        message: options.createGithubRepository.desc,
        type: 'confirm',
        default: true,
      },
    ]);

    Object.assign(this.props, answers, {
      repository: `${answers.githubUsername}/${this.props.projectName}`,
    });
  }

  async _promptTravis() {
    const answers = await this.generator.prompt([
      {
        name: 'travisCI',
        message: options.travisCI.desc,
        type: 'confirm',
        default: true,
        when: this._logHelpWhenPrompt(options.travisCI.help),
      },
      {
        name: 'coveralls',
        message: options.coveralls.desc,
        type: 'confirm',
        default: true,
        when: ({ travisCI }) => {
          if (travisCI) {
            this.generator.log(options.coveralls.help());
            return true;
          }

          return false;
        },
      },
    ]);

    Object.assign(this.props, answers, { coveralls: answers.coveralls });
  }

  async _promptNpm() {
    const answers = await this.generator.prompt([
      {
        name: 'npmDeploy',
        message: options.npmDeploy.desc,
        type: 'confirm',
        default: true,
        when: () => {
          if (this.props.travisCI) {
            this.generator.log(options.npmDeploy.help());
            return true;
          }

          return false;
        },
      },
      {
        name: 'semanticRelease',
        message: options.semanticRelease.desc,
        type: 'confirm',
        default: true,
        when: ({ npmDeploy }) => {
          if (npmDeploy) {
            this.generator.log(options.semanticRelease.help());
            return true;
          }

          return false;
        },
      },
    ]);

    Object.assign(this.props, {
      npmDeploy: answers.npmDeploy,
      semanticRelease: answers.semanticRelease,
    });
  }

  async _promptPasswords() {
    const { createGithubRepository, semanticRelease, npmDeploy } = this.props;

    if (createGithubRepository || semanticRelease) {
      this._logGithubPasswordRequired();
      this._logPasswordSafety();
      await this._loginToGithub();
    }

    if (npmDeploy) {
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
    const { token } = await npmLogin({
      username: npmUsername,
      password: npmPassword,
    });

    Object.assign(this.props, {
      npmToken: token,
    });
  }

  async _loginToGithub() {
    const {
      githubUsername: username,
      semanticRelease,
      repository,
    } = this.props;
    const { githubPassword: password } = await this._promptGithubPassword();

    this.props.github = new Github(username, password, () => this.github2fa());

    if (semanticRelease) {
      this.props.githubToken = await this.props.github.createToken(repository);
    }
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

  _logHelpWhenPrompt(help) {
    return () => {
      this.generator.log(help());
      return true;
    };
  }

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
}
