# generator-node-mdl

> Create a Node.js module with ease

[![Package Version](https://img.shields.io/npm/v/generator-node-mdl.svg?style=flat-square)](https://www.npmjs.com/package/generator-node-mdl)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Downloads Status](https://img.shields.io/npm/dm/generator-node-mdl.svg?style=flat-square)](https://npm-stat.com/charts.html?package=generator-node-mdl&from=2016-04-01)
[![Build Status: Linux](https://img.shields.io/travis/sharvit/generator-node-mdl/master.svg?style=flat-square)](https://travis-ci.org/sharvit/generator-node-mdl)
[![Coverage Status](https://coveralls.io/repos/github/sharvit/generator-node-mdl/badge.svg?branch=master)](https://coveralls.io/github/sharvit/generator-node-mdl?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![dependencies Status](https://david-dm.org/sharvit/generator-node-mdl/status.svg)](https://david-dm.org/sharvit/generator-node-mdl)
[![devDependencies Status](https://david-dm.org/sharvit/generator-node-mdl/dev-status.svg)](https://david-dm.org/sharvit/generator-node-mdl?type=dev)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![MIT License](https://img.shields.io/npm/l/stack-overflow-copy-paste.svg?style=flat-square)](http://opensource.org/licenses/MIT) [![Greenkeeper badge](https://badges.greenkeeper.io/sharvit/generator-node-mdl.svg)](https://greenkeeper.io/)

See [node-mdl-starter](https://github.com/sharvit/node-mdl-starter), it is an example of what you get using this generator and it is automatically generated with every new release of this generator.

## Why

- Generates a simple but _ready to start_ project
- Includes only necessary tools
- Monitors repo quality through helpful badges
- [Supports ES2015+ using Babel 7](https://babeljs.io)
- [Jest testing framework](https://facebook.github.io/jest)
- Sensible [ESLint](http://eslint.org) config extends [standard](https://github.com/standard/eslint-config-standard) and [Prettier](https://github.com/prettier/eslint-plugin-prettier)
- Automates code reformatting using [Prettier](https://github.com/prettier/prettier)
- Build your documentations using [esdoc](https://esdoc.org) _(optional)_
- [Travis CI](https://travis-ci.org) configuration _(optional)_
- [Coveralls](http://coveralls.io) configuration _(optional)_
- Automatically deploy to [npm registry](https://www.npmjs.com) with [Travis CI](https://travis-ci.org)  _(optional)_
- Automates versioning releases with [semantic-release](https://github.com/semantic-release/semantic-release) and [commitizen](https://github.com/commitizen/cz-cli)  _(optional)_
- Friendly for contributions using [Issue, Pull Request, and Contributing templates](https://github.com/blog/2111-issue-and-pull-request-templates) and some extras _(optional)_

## Installation

```sh
npm install --global yo generator-node-mdl
```

## Usage

```sh
yo node-mdl
# answer questions
```

With the most basic options, youʼll get a project structured like this:

```sh
$ tree
.
├── .github
│   ├── issue_template.md
│   └── pull_request_template.md
├── other
│   ├── code_of_conduct.md
│   ├── examples.md
│   └── roadmap.md
├── src
│   ├── index.js
│   └── index.test.js
├── .babelrc
├── .editorconfig
├── .esdoc.json
├── .eslintignore
├── .eslintrc
├── .gitattributes
├── .gitignore
├── .npmignore
├── .travis.yml
├── contributing.md
├── license
├── package.json
├── readme.md
└── yarn.lock
```

Less boilerplate 🎉

## Options

There are 2 ways to supply your data to this generator.
The obvious way is runnin `yo node-mdl` and answer all questions. You can bypass questions by passing options as arguments.

Run `yo node-mdl --help` to see the different options.

## About passwords and tokens

This project contain some features that will make your life easier when setting up a new open-source project. Based on your choices, you may be asked to supply some of your accounts usernames and passwords (github, npm, etc...) so this project will automatically produce tokens for those accounts and save them to your TravisCI as secured enviorment variables if needed. You can bypass those questions by manually creating tokens and supply them using options as arguments.

1. `--npmToken my-token` is needed when using with `--npmDeploy`.

   Your token will end up in `TravisCI` as a secured enviorment variables called `NPM_TOKEN`.

   [creating and viewing npm authentication tokens](https://docs.npmjs.com/creating-and-viewing-authentication-tokens)

2. `--githubToken my-token` is needed when using with `--createGithubRepository` or with `--travisCI`.

   [creating and viewing github authentication tokens](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line)

   - When using with `--createGithubRepository` your token doesn't need to contain any scope.

   - When using with `--travisCI` but without `--semanticRelease` your token doesn't need to contain any scope.

   - When using with `--travisCI` and with `--semanticRelease` your token need to contain the following scopes:
     - `repo`
     - `read:org`
     - `user:email`
     - `repo_deployment`
     - `repo:status`
     - `write:repo_hook`

## FAQ

### How to upgrade existing project scaffolded with Yeoman?

Read how to do it [here](https://stackoverflow.com/a/18500003).

## Forked from

[generator-oss](https://github.com/luftywiranda13/generator-node-oss) － Supports ES2015+ and [XO](https://github.com/xojs/xo) by default

## Related

- [generator-bunny](https://github.com/luftywiranda13/generator-bunny) － Supports ES2015+ and [Flow](https://flow.org) by default
- [generator-kcd-oss](https://github.com/kentcdodds/generator-kcd-oss) － Lots of features but many things left untouched
- [generator-nm](https://github.com/sindresorhus/generator-nm) － A way simpler Yeoman generator

## License

MIT &copy; [Avi Sharvit](https://sharvit.github.io)
