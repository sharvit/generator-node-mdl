'use strict';

const path = require('path');

const _ = require('lodash');
const commandExists = require('command-exists').sync;
const findUp = require('find-up');
const Generator = require('yeoman-generator');
const isArrayElem = require('is-array-elem');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  initializing() {
    this.props = {};
  }

  prompting() {
    return this.prompt([
      {
        name: 'projectName',
        message: 'Project name',
        default: this.appname,
      },
      {
        name: 'description',
        message: 'Description',
        default: 'as cute as bunny',
        store: true,
      },
      {
        name: 'extras',
        message: 'Extra features',
        type: 'checkbox',
        choices: [
          {
            name: 'Code Coverage',
            value: 'coverage',
            checked: true,
          },
          {
            name: 'Auto-formatting with Prettier',
            value: 'prettier',
          },
          {
            name: 'ESNext with Babel',
            value: 'esnext',
          },
          {
            name: 'GitHub templates',
            value: 'githubTemplates',
          },
        ],
      },
      {
        name: 'name',
        message: "Author's name",
        default: this.user.git.name(),
      },
      {
        name: 'email',
        message: "Author's email",
        default: this.user.git.email(),
      },
      {
        name: 'website',
        message: "Author's website",
        store: true,
      },
      {
        name: 'githubUsername',
        message: 'GitHub username',
        store: true,
      },
    ]).then(answers => {
      this.props = {
        projectName: _.kebabCase(answers.projectName),
        camelProject: _.camelCase(answers.projectName),
        description: answers.description,
        coverage: isArrayElem(answers.extras, 'coverage'),
        esnext: isArrayElem(answers.extras, 'esnext'),
        prettier: isArrayElem(answers.extras, 'prettier'),
        githubTemplates: isArrayElem(answers.extras, 'githubTemplates'),
        name: answers.name,
        email: answers.email,
        website: answers.website,
        githubUsername: answers.githubUsername,
      };
    });
  }

  configuring() {
    if (path.basename(this.destinationPath()) !== this.props.projectName) {
      mkdirp(this.props.projectName);
      this.destinationRoot(this.destinationPath(this.props.projectName));
    }
  }

  default() {
    this.spawnCommandSync('git', ['init'], { stdio: false });
  }

  writing() {
    this.fs.copyTpl(
      [
        `${this.templatePath()}/**`,
        '!**/_babelrc',
        '!**/_github/**',
        '!**/contributing.md',
        '!**/other/**',
      ],
      this.destinationPath(),
      this.props
    );

    const mv = (from, to) => {
      this.fs.move(this.destinationPath(from), this.destinationPath(to));
    };

    mv('_editorconfig', '.editorconfig');
    mv('_gitattributes', '.gitattributes');
    mv('_gitignore', '.gitignore');
    mv('_package.json', 'package.json');
    mv('_test.js', 'test.js');
    mv('_travis.yml', '.travis.yml');

    if (this.props.esnext) {
      mv('index.js', 'src/index.js');
      mv('test.js', 'src/index.test.js');
      this.fs.copy(
        this.templatePath('_babelrc'),
        this.destinationPath('.babelrc')
      );
    }

    if (this.props.githubTemplates) {
      this.fs.copyTpl(
        this.templatePath('_github'),
        this.destinationPath('.github'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('other'),
        this.destinationPath('other'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('contributing.md'),
        this.destinationPath('contributing.md'),
        this.props
      );
    }
  }
  install() {
    const hasYarn = commandExists('yarn');

    this.installDependencies({
      bower: false,
      npm: !hasYarn,
      yarn: hasYarn,
    });
  }

  end() {
    this.fs.delete(findUp.sync('.yo-rc.json'));
  }
};
