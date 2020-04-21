import path from 'path';
import chalk from 'chalk';
import findUp from 'find-up';
import makeDir from 'make-dir';

import Commander from '../../lib/commander';
import BaseGenerator from '../base-generator';

export default class extends BaseGenerator {
  constructor(...args) {
    super(...args);

    this.commander = new Commander({
      spawnSync: this.spawnCommandSync.bind(this),
      log: this.log.bind(this),
    });
  }
  /*
    Run Loop
   */

  configuring() {
    if (path.basename(this.destinationRoot()) !== this.options.projectName) {
      return makeDir(this.options.projectName).then((path) => {
        this.destinationRoot(path);
        this.log(chalk`\nGenerating a new project in {green ${path}}\n`);
      });
    }
  }

  writing() {
    const templatesToCopy = [
      { templatePath: '_babelrc', destinationPath: '.babelrc' },
      { templatePath: '_editorconfig', destinationPath: '.editorconfig' },
      { templatePath: '_eslintignore', destinationPath: '.eslintignore' },
      { templatePath: '_eslintrc', destinationPath: '.eslintrc' },
      { templatePath: '_gitattributes', destinationPath: '.gitattributes' },
      { templatePath: '_gitignore', destinationPath: '.gitignore' },
      { templatePath: '_npmignore', destinationPath: '.npmignore' },
      { templatePath: '_package.json', destinationPath: 'package.json' },
      { templatePath: 'license', destinationPath: 'license' },
      { templatePath: 'readme.md', destinationPath: 'readme.md' },
      { templatePath: 'src', destinationPath: 'src' },
      {
        templatePath: 'config/jest.config.js',
        destinationPath: 'config/jest.config.js',
      },
      {
        templatePath: 'config/webpack.config.js',
        destinationPath: 'config/webpack.config.js',
      },
    ];

    if (this.options.esdoc) {
      templatesToCopy.push({
        templatePath: 'config/esdoc.config.js',
        destinationPath: 'config/esdoc.config.js',
      });
    }

    if (this.options.npmDeploy && this.options.semanticRelease) {
      templatesToCopy.push({
        templatePath: 'config/commitlint.config.js',
        destinationPath: 'config/commitlint.config.js',
      });
    }

    templatesToCopy.forEach(({ templatePath, destinationPath }) =>
      this.fs.copyTpl(
        this.templatePath(templatePath),
        this.destinationPath(destinationPath),
        this.options
      )
    );
  }

  install() {
    this._installNpmDeps();
  }

  async end() {
    const { repository } = this.options;
    await this._removeYoRc();

    this._createGit();

    this.log('\n\n\n');
    this.log(chalk`{bold.yellow Thank you for using generator-node-mdl!}`);
    this.log('\n\n\n');
    this.log(chalk`{bold.underline What's next:}\n`);

    this.log(chalk`  Push your changes to git: {gray git push origin master}`);
    this.log(
      chalk`  Read your project contributing guide: {underline.cyan https://github.com/${repository}/blob/master/contributing.md}`
    );
    this.log(
      chalk`  Enable greenkeeper for your project by visiting: {underline.cyan https://account.greenkeeper.io/}`
    );
  }

  /*
    Private Methods
   */

  _installNpmDeps() {
    const { hasYarn } = this.options;

    return this.installDependencies({
      bower: false,
      npm: !hasYarn,
      yarn: hasYarn,
      skipMessage: true,
    });
  }

  _createGit() {
    const { repository } = this.options;

    this.log('Initiating git:');

    this.commander.run([
      'git init --quiet',
      `git remote add origin git@github.com:${repository}.git`,
      'git add .',
      [
        'git',
        'commit',
        '-m',
        'chore(init): generated by generator-node-mdl 🔥',
        '--quiet',
      ],
    ]);
  }

  async _removeYoRc() {
    const yoRC = await findUp('.yo-rc.json');

    if (yoRC) {
      this.fs.delete(yoRC);

      await new Promise((resolve, reject) => {
        this.fs.commit(() => resolve());
      });
    }
  }
}
