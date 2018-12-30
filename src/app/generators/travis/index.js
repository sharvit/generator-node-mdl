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

    const { repository, npmDeploy, npmToken } = this.props;

    this.spawnCommandSync('gem', [
      'install',
      'travis',
      '--no-ri',
      '--no-rdoc',
      '--quiet',
    ]);
    this.spawnCommandSync('travis', ['login', '--auto']);
    this.spawnCommandSync('travis', ['enable', '-r', repository]);

    if (npmDeploy) {
      this.spawnCommandSync('travis', [
        'env',
        'set',
        'NPM_TOKEN',
        npmToken,
        '-r',
        repository,
      ]);
    }
  }
}
