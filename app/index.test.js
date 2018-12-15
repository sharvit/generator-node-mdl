'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const runAppGenerator = () => helpers.run(path.join(__dirname, './index.js'));

test('destinationRoot', () => {
  return runAppGenerator()
    .withPrompts({ projectName: 'temp' })
    .then(() => {
      assert.equal(path.basename(process.cwd()), 'temp');
    });
});

test('default files', () => {
  return runAppGenerator().then(() => {
    assert.file([
      '.git',
      '.babelrc',
      '.editorconfig',
      '.eslintignore',
      '.eslintrc',
      '.gitattributes',
      '.gitignore',
      'license',
      'package.json',
      'readme.md',
      'src/index.js',
      'src/index.test.js',
      // githubTemplates
      'contributing.md',
      '.github/issue_template.md',
      '.github/pull_request_template.md',
      'other/code_of_conduct.md',
      'other/examples.md',
      'other/roadmap.md',
      // travisCI
      '.travis.yml',
      // npmDeploy
      '.npmignore',
    ]);

    assert.noFile([
      '_babelrc',
      '_editorconfig',
      '_eslintignore',
      '_eslintrc',
      '_gitattributes',
      '_gitignore',
      '_travis.yml',
      '_npmignore',
      '_github/issue_template.md',
      '_github/pull_request_template.md',
    ]);
  });
});

describe('prompts', () => {
  test('projectName', () => {
    return runAppGenerator()
      .withPrompts({
        githubUsername: 'foo',
        projectName: 'bar',
      })
      .then(() => {
        assert.jsonFileContent('package.json', {
          name: 'bar',
          repository: 'https://github.com/foo/bar',
        });

        assert.fileContent(
          'readme.md',
          '[![Package Version](https://img.shields.io/npm/v/bar.svg?style=flat-square)](https://www.npmjs.com/package/bar)'
        );
        assert.fileContent(
          'readme.md',
          '[![Build Status: Linux](https://img.shields.io/travis/foo/bar/master.svg?style=flat-square)](https://travis-ci.org/foo/bar)'
        );
        assert.fileContent(
          'readme.md',
          '[![Downloads Status](https://img.shields.io/npm/dm/bar.svg?style=flat-square)](https://npm-stat.com/charts.html?package=bar&from=2016-04-01)'
        );

        assert.fileContent('readme.md', '# bar');
        assert.fileContent('readme.md', 'npm install --save bar');
        assert.fileContent('readme.md', "const bar = require('bar');");
      });
  });

  test('description', () => {
    return runAppGenerator()
      .withPrompts({ description: 'foo' })
      .then(() => {
        assert.jsonFileContent('package.json', {
          description: 'foo',
        });
        assert.fileContent('readme.md', 'foo');
      });
  });

  test('name', () => {
    return runAppGenerator()
      .withPrompts({ name: 'foo bar' })
      .then(() => {
        assert.jsonFileContent('package.json', {
          author: {
            name: 'foo bar',
          },
        });

        assert.fileContent('license', 'foo bar');
        assert.fileContent('readme.md', 'MIT &copy; [foo bar]');
      });
  });

  test('email', () => {
    return runAppGenerator()
      .withPrompts({ email: 'foo@bar.com' })
      .then(() => {
        assert.jsonFileContent('package.json', {
          author: {
            email: 'foo@bar.com',
          },
        });

        assert.fileContent('license', 'foo@bar.com');
      });
  });

  test('website', () => {
    return runAppGenerator()
      .withPrompts({ website: 'test.com' })
      .then(() => {
        assert.jsonFileContent('package.json', {
          author: {
            url: 'test.com',
          },
        });

        assert.fileContent('readme.md', 'test.com');
      });
  });

  test('githubTemplates', () => {
    return runAppGenerator()
      .withPrompts({
        githubUsername: 'foo',
        projectName: 'bar',
        email: 'foo@test.com',
        githubTemplates: true,
      })
      .then(() => {
        assert.fileContent('contributing.md', 'https://github.com/foo/bar');
        assert.fileContent(
          '.github/issue_template.md',
          /bar version: <!-- run `npm ls bar` -->/
        );
        assert.fileContent(
          '.github/pull_request_template.md',
          'https://github.com/foo/bar/blob/master/contributing.md'
        );
        assert.fileContent('other/code_of_conduct.md', 'foo@test.com');
      });
  });

  test('no githubTemplates', () => {
    return runAppGenerator()
      .withPrompts({
        githubTemplates: false,
      })
      .then(() => {
        assert.noFile([
          'contributing.md',
          '.github/issue_template.md',
          '.github/pull_request_template.md',
          'other/code_of_conduct.md',
          'other/examples.md',
          'other/roadmap.md',
        ]);
      });
  });

  describe('Travis', () => {
    test('travisCI', () => {
      return runAppGenerator()
        .withPrompts({
          travisCI: true,
        })
        .then(() => {
          assert.file(['.travis.yml']);
        });
    });

    test('no travisCI', () => {
      return runAppGenerator()
        .withPrompts({
          travisCI: false,
        })
        .then(() => {
          assert.noFile(['.travis.yml']);
        });
    });

    test('coveralls', () => {
      return runAppGenerator()
        .withPrompts({
          travisCI: true,
          coveralls: true,
        })
        .then(() => {
          assert.fileContent('.travis.yml', 'after_success: yarn coveralls');
        });
    });

    test('no coveralls', () => {
      return runAppGenerator()
        .withPrompts({
          travisCI: true,
          coveralls: false,
        })
        .then(() => {
          assert.noFileContent('.travis.yml', 'after_success: yarn coveralls');
        });
    });

    test('npmDeploy', () => {
      const npmSecureApiKey = 'npm-secure-api-key';

      return runAppGenerator()
        .withPrompts({
          travisCI: true,
          npmDeploy: true,
          npmSecureApiKey,
        })
        .then(() => {
          assert.file(['.npmignore']);
          assert.fileContent('.travis.yml', 'deploy');
          assert.fileContent('.travis.yml', `secure: ${npmSecureApiKey}`);
        });
    });

    test('no npmDeploy', () => {
      return runAppGenerator()
        .withPrompts({
          travisCI: true,
          npmDeploy: false,
        })
        .then(() => {
          assert.noFile(['.npmignore']);
          assert.noFileContent('.travis.yml', 'deploy');
        });
    });
  });
});