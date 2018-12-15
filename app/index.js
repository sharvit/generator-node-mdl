'use strict';

const path = require('path');
const Generator = require('yeoman-generator');
const camelCase = require('lodash.camelcase');
const kebabCase = require('lodash.kebabcase');
const includes = require('lodash.includes');
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
        default: kebabCase(this.appname),
        filter: kebabCase,
      },
      {
        name: 'description',
        message: 'Description',
        default: 'Generated by `generator-node-mdl`',
        store: true,
      },
      {
        name: 'extras',
        message: 'Extra features',
        type: 'checkbox',
        choices: [
          {
            name: 'GitHub templates',
            value: 'githubTemplates',
            checked: true,
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
        projectName: answers.projectName,
        camelProject: camelCase(answers.projectName),
        description: answers.description,
        githubTemplates: includes(answers.extras, 'githubTemplates'),
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
    mv('_eslintignore', '.eslintignore');
    mv('_travis.yml', '.travis.yml');
    mv('_babelrc', '.babelrc');
    mv('_eslintrc', '.eslintrc');

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
    });
  }

  end() {
    this.spawnCommandSync('git', ['init', '--quiet']);

    findUp('.yo-rc.json').then(res => {
      if (res) {
        this.fs.delete(res);
      }
    });
  }
};
