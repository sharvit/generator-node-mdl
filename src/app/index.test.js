import Generator from './index';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const github = require('./lib/github');

jest.mock('./lib/github');
jest.mock('./lib/npm');

const runAppGenerator = () => helpers.run(Generator);

beforeEach(() => jest.clearAllMocks());

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
      '.npmignore',
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

        assert.fileContent('.git/config', '[remote "origin"]');
        assert.fileContent('.git/config', 'git@github.com:foo/bar.git');

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

  test('createGithubRepository', () => {
    const name = 'some-project-name';
    const description = 'some-description';
    const username = 'some-username';
    const password = 'some-password';

    return runAppGenerator()
      .withPrompts({
        createGithubRepository: true,
        projectName: name,
        description,
        githubUsername: username,
        githubPassword: password,
      })
      .then(() => {
        expect(github.login).toBeCalledWith({ username, password });
        expect(github.createRepository).toBeCalledWith({ name, description });
      });
  });

  test('no createGithubRepository', () => {
    return runAppGenerator()
      .withPrompts({
        createGithubRepository: false,
        npmDeploy: false,
        githubUsername: 'some-username',
        githubPassword: 'some-password',
        projectName: 'some-project-name',
      })
      .then(() => {
        expect(github.login).not.toBeCalled();
        expect(github.createRepository).not.toBeCalled();
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
      return runAppGenerator()
        .withPrompts({
          travisCI: true,
          npmDeploy: true,
          semanticRelease: false,
          npmUsername: 'some-username',
          npmPassword: 'some-password',
        })
        .then(() => {
          assert.fileContent('.travis.yml', 'deploy:');
          assert.fileContent('.travis.yml', 'provider: npm');
          assert.fileContent('.travis.yml', 'api_key: $NPM_TOKEN');

          assert.noFileContent('.travis.yml', 'provider: script');
          assert.noFileContent('.travis.yml', 'yarn semantic-release');

          assert.noFileContent(
            'package.json',
            '"version": "0.0.0-semantic-release"'
          );
          assert.noFileContent(
            'package.json',
            '"semantic-release": "semantic-release"'
          );
          assert.noFileContent('package.json', '@commitlint/cli');
          assert.noFileContent(
            'package.json',
            '@commitlint/config-conventional'
          );
          assert.noFileContent('package.json', '@commitlint/travis-cli');
          assert.noFileContent(
            'package.json',
            '"path": "./node_modules/cz-conventional-changelog"'
          );
        });
    });

    test('no npmDeploy', () => {
      return runAppGenerator()
        .withPrompts({
          travisCI: true,
          npmDeploy: false,
        })
        .then(() => {
          assert.noFileContent('.travis.yml', 'deploy');
        });
    });

    test('npmDeploy with semanticRelease', () => {
      return runAppGenerator()
        .withPrompts({
          travisCI: true,
          npmDeploy: true,
          semanticRelease: true,
          npmUsername: 'some-username',
          npmPassword: 'some-password',
          githubUsername: 'some-username',
          githubPassword: 'some-password',
        })
        .then(() => {
          assert.fileContent('.travis.yml', 'deploy:');
          assert.fileContent('.travis.yml', 'provider: script');
          assert.fileContent('.travis.yml', 'yarn semantic-release');

          assert.fileContent(
            'package.json',
            '"version": "0.0.0-semantic-release"'
          );
          assert.fileContent(
            'package.json',
            '"semantic-release": "semantic-release"'
          );
          assert.fileContent('package.json', '@commitlint/cli');
          assert.fileContent('package.json', '@commitlint/config-conventional');
          assert.fileContent('package.json', '@commitlint/travis-cli');
          assert.fileContent(
            'package.json',
            '"path": "./node_modules/cz-conventional-changelog"'
          );
        });
    });
  });
});
