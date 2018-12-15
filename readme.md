# generator-node-mdl

> Create a Node.js project with ease

[![Package Version](https://img.shields.io/npm/v/generator-node-mdl.svg?style=flat-square)](https://www.npmjs.com/package/generator-node-mdl)
[![Downloads Status](https://img.shields.io/npm/dm/generator-node-mdl.svg?style=flat-square)](https://npm-stat.com/charts.html?package=generator-node-mdl&from=2016-04-01)
[![Build Status: Linux](https://img.shields.io/travis/sharvit/generator-node-mdl/master.svg?style=flat-square)](https://travis-ci.org/sharvit/generator-node-mdl)
[![Coverage Status](https://coveralls.io/repos/github/sharvit/generator-node-mdl/badge.svg?branch=master)](https://coveralls.io/github/sharvit/generator-node-mdl?branch=master)

## Why

- Generates a simple but _ready to start_ project
- Includes only necessary tools
- Monitors repo quality through helpful badges
- [Jest testing framework](https://facebook.github.io/jest)
- Sensible [ESLint](http://eslint.org) config extends [standard](https://github.com/standard/eslint-config-standard) and [Prettier](https://github.com/prettier/eslint-plugin-prettier)
- Automates code reformatting using [Prettier](https://github.com/prettier/prettier)
- [Travis CI](https://travis-ci.org) configuration
- [Issue, Pull Request, and Contributing templates](https://github.com/blog/2111-issue-and-pull-request-templates) _(optional)_
- [Supports ES2015+ using Babel](https://babeljs.io) _(optional)_

## Installation

```sh
npm install --global yo generator-node-mdl
```

## Usage

```sh
yo node-mdl
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
├── .eslintrc
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .eslintignore
├── .travis.yml
├── license
├── contributing.md
├── package.json
└── readme.md
```

Less boilerplate 🎉

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
