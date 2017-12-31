'use strict';

const path = require('path');
const Generator = require('yeoman-generator');
const _ = require('lodash');
const chalk = require('chalk');
const commandExists = require('command-exists');
const findUp = require('find-up');
const makeDir = require('make-dir');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        name: 'projectName',
        message: 'Project name',
        default: _.kebabCase(this.appname),
        filter: _.kebabCase,
      },
      {
        name: 'description',
        message: 'Description',
        default: 'Generated by `generator-node-oss`',
        filter: _.trim,
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
        filter: _.trim,
      },
      {
        name: 'email',
        message: "Author's email",
        default: this.user.git.email(),
        filter: _.trim,
      },
      {
        name: 'website',
        message: "Author's website",
        filter: _.trim,
        store: true,
      },
      {
        name: 'githubUsername',
        message: 'GitHub username',
        filter: _.trim,
        store: true,
      },
    ]).then(answers => {
      this.props = {
        projectName: answers.projectName,
        camelProject: _.camelCase(answers.projectName),
        description: answers.description,
        coverage: _.includes(answers.extras, 'coverage'),
        esnext: _.includes(answers.extras, 'esnext'),
        prettier: _.includes(answers.extras, 'prettier'),
        githubTemplates: _.includes(answers.extras, 'githubTemplates'),
        name: answers.name,
        email: answers.email,
        website: answers.website,
        githubUsername: answers.githubUsername,
      };
    });
  }

  configuring() {
    if (path.basename(this.destinationRoot()) !== this.props.projectName) {
      return makeDir(this.props.projectName).then(path => {
        this.destinationRoot(path);
        this.log(`\nGenerating a new project in ${chalk.green(path)}\n`);
      });
    }
  }

  writing() {
    this.fs.copyTpl(
      [
        `${this.templatePath()}/**`,
        '!**/_babelrc',
        '!**/_github/**',
        '!**/_prettierignore',
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

    if (this.props.prettier) {
      this.fs.copy(
        this.templatePath('_prettierignore'),
        this.destinationPath('.prettierignore')
      );
    }

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
    const hasYarn = commandExists.sync('yarn');

    this.installDependencies({
      bower: false,
      npm: !hasYarn,
      yarn: hasYarn,
    })
      .then(() => this.spawnCommandSync('git', ['init', '--quiet']))
      .then(() => this.fs.delete(findUp.sync('.yo-rc.json')))
      .catch(() => {});
  }
};
