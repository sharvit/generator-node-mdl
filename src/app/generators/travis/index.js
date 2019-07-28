import chalk from 'chalk';
import BaseGenerator from '../base-generator';

export default class extends BaseGenerator {
  writing() {
    this.fs.copyTpl(
      this.templatePath('_travis.yml'),
      this.destinationPath('.travis.yml'),
      this.options
    );
  }

  async install() {
    if (process.env.NODE_ENV === 'test') return;

    this.log('Installing TravisCI...');

    const { npmDeploy, semanticRelease } = this.options;

    this._installTravis();

    if (npmDeploy) {
      this._installTravisNpmToken();

      if (semanticRelease) {
        this._installTravisGithubToken();
      }
    }

    this.log('\n');
  }

  end() {
    const { repository } = this.options;

    this.log(
      chalk`  Visit your TravisCI url: {underline.cyan https://travis-ci.org/${repository}}`
    );
  }

  _installTravis() {
    const { repository } = this.options;

    this.spawnCommandSync('gem', [
      'install',
      'travis',
      '--no-ri',
      '--no-rdoc',
      '--quiet',
    ]);
    this.spawnCommandSync('travis', ['login', '--auto']);
    this.spawnCommandSync('travis', ['enable', '-r', repository]);
  }

  _installTravisNpmToken() {
    const { repository, npmToken } = this.options;

    this.spawnCommandSync('travis', [
      'env',
      'set',
      'NPM_TOKEN',
      npmToken,
      '-r',
      repository,
    ]);
  }

  _installTravisGithubToken() {
    const { repository, githubToken } = this.options;

    this.spawnCommandSync('travis', [
      'env',
      'set',
      'GH_TOKEN',
      githubToken,
      '-r',
      repository,
    ]);
  }
}
