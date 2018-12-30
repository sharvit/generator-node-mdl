import camelCase from 'lodash.camelcase';
import kebabCase from 'lodash.kebabcase';

import { login as githubLogin } from './lib/github';
import { login as npmLogin } from './lib/npm';

import options from './options';

export default class Prompter {
  constructor(generator) {
    this.generator = generator;
  }

  async prompt() {
    this.props = {};

    await this._promptGeneral();
    await this._promptGithub();
    await this._promptTravis();
    await this._promptNpm();

    return this.props;
  }

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

    if (answers.createGithubRepository) {
      await this._loginToGithub();
    }
  }

  async _promptTravis() {
    const answers = await this.generator.prompt([
      {
        name: 'travisCI',
        message: options.travisCI.desc,
        type: 'confirm',
        default: true,
        when: () => {
          this.generator.log(
            '\nLearn how to use Travis CI: https://docs.travis-ci.com/user/tutorial/#to-get-started-with-travis-ci'
          );
          return true;
        },
      },
      {
        name: 'coveralls',
        message: options.coveralls.desc,
        type: 'confirm',
        default: true,
        when: ({ travisCI }) => {
          if (travisCI) {
            this.generator.log(
              '\nLearn how to use Coveralls: https://coveralls.io'
            );
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
            this.generator.log(
              '\nNeed to have an npm account: https://www.npmjs.com/'
            );
            return true;
          }

          return false;
        },
      },
    ]);

    Object.assign(this.props, {
      npmDeploy: answers.npmDeploy,
    });

    if (this.props.npmDeploy) {
      await this._loginToNpm();
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
    const { githubUsername } = this.props;
    const { githubPassword } = await this._promptGithubPassword();

    githubLogin({
      username: githubUsername,
      password: githubPassword,
    });
  }
}
