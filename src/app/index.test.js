import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

import Generator from './index';
import Github from './lib/github';

jest.mock('./lib/github');
jest.mock('./lib/npm');

Github.use2fa = false;

const runAppGenerator = () => helpers.run(Generator);

beforeEach(() => jest.clearAllMocks());

const requiredPrompts = {
  githubUsername: 'github-username',
};

test('destinationRoot', () => {
  return runAppGenerator()
    .withPrompts({ ...requiredPrompts, projectName: 'temp' })
    .then(() => {
      assert.equal(path.basename(process.cwd()), 'temp');
    });
});

test('default files', () => {
  return runAppGenerator()
    .withPrompts(requiredPrompts)
    .then(() => {
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
        'config/jest.config.js',
        'src/index.js',
        'src/index.test.js',
        // esdoc
        'config/esdoc.config.js',
        // githubTemplates
        'contributing.md',
        '.github/issue_template.md',
        '.github/pull_request_template.md',
        'other/code_of_conduct.md',
        'other/examples.md',
        'other/roadmap.md',
        // travisCI
        '.travis.yml',
        // semanticRelease
        'config/commitlint.config.js',
      ]);

      assert.noFile([
        '_babelrc',
        '_editorconfig',
        '_esdoc.json',
        '_eslintignore',
        '_eslintrc',
        '_gitattributes',
        '_gitignore',
        '_travis.yml',
        '_npmignore',
        '_github/issue_template.md',
        '_github/pull_request_template.md',
        '_commitlintrc.json',
      ]);
    });
});

test('default files with --noDefaults', () => {
  return runAppGenerator()
    .withOptions({ noDefaults: true })
    .withPrompts(requiredPrompts)
    .then(() => {
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
        'config/jest.config.js',
        'src/index.js',
        'src/index.test.js',
      ]);

      assert.noFile([
        'config/commitlint.config.js',
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
        '_commitlintrc.json',
        // esdoc
        '_esdoc.json',
        'config/esdoc.config.js',
        // githubTemplates
        'contributing.md',
        '.github/issue_template.md',
        '.github/pull_request_template.md',
        'other/code_of_conduct.md',
        'other/examples.md',
        'other/roadmap.md',
        // travisCI
        '.travis.yml',
        // semanticRelease
        'config/commitlint.config.js',
      ]);
    });
});

describe('prompts', () => {
  test('projectName', () => {
    return runAppGenerator()
      .withPrompts({
        ...requiredPrompts,
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
      .withPrompts({ ...requiredPrompts, description: 'foo' })
      .then(() => {
        assert.jsonFileContent('package.json', {
          description: 'foo',
        });
        assert.fileContent('readme.md', 'foo');
      });
  });

  test('name', () => {
    return runAppGenerator()
      .withPrompts({ ...requiredPrompts, name: 'foo bar' })
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
      .withPrompts({ ...requiredPrompts, email: 'foo@bar.com' })
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
      .withPrompts({ ...requiredPrompts, website: 'test.com' })
      .then(() => {
        assert.jsonFileContent('package.json', {
          author: {
            url: 'test.com',
          },
        });

        assert.fileContent('readme.md', 'test.com');
      });
  });

  test('createGithubRepository with token', () => {
    const name = 'some-project-name';
    const description = 'some-description';
    const githubToken = 'some-token';

    return runAppGenerator()
      .withOptions({
        githubToken,
      })
      .withPrompts({
        ...requiredPrompts,
        createGithubRepository: true,
        projectName: name,
        description,
      })
      .then(() => {
        expect(Github).toBeCalledWith({
          token: `token ${githubToken}`,
        });
        expect(Github.prototype.createRepository).toBeCalledWith({
          name,
          description,
        });
      });
  });

  test('createGithubRepository with username and password', () => {
    const name = 'some-project-name';
    const description = 'some-description';
    const username = 'some-username';
    const password = 'some-password';

    return runAppGenerator()
      .withPrompts({
        ...requiredPrompts,
        createGithubRepository: true,
        projectName: name,
        description,
        githubUsername: username,
        githubPassword: password,
      })
      .then(() => {
        expect(Github).toBeCalledWith({
          username,
          password,
          on2fa: expect.any(Function),
        });
        expect(Github.prototype.createRepository).toBeCalledWith({
          name,
          description,
        });
      });
  });

  test('createGithubRepository with username, password and 2fa', () => {
    Github.use2fa = true;

    const name = 'some-project-name';
    const description = 'some-description';
    const username = 'some-username';
    const password = 'some-password';
    const github2fa = 'github2fa';

    return runAppGenerator()
      .withPrompts({
        ...requiredPrompts,
        createGithubRepository: true,
        projectName: name,
        description,
        githubUsername: username,
        githubPassword: password,
        github2fa,
      })
      .then(() => {
        expect(Github).toBeCalledWith({
          username,
          password,
          on2fa: expect.any(Function),
        });
        expect(Github.prototype.createRepository).toBeCalledWith({
          name,
          description,
        });

        Github.use2fa = false;
      });
  });

  test('no createGithubRepository', () => {
    return runAppGenerator()
      .withPrompts({
        ...requiredPrompts,
        createGithubRepository: false,
        travisCI: false,
        npmDeploy: false,
        githubUsername: 'some-username',
        githubPassword: 'some-password',
        projectName: 'some-project-name',
      })
      .then(() => {
        expect(Github).not.toBeCalled();
        expect(Github.prototype.createRepository).not.toBeCalled();
      });
  });

  test('esdoc', () => {
    return runAppGenerator()
      .withPrompts({
        ...requiredPrompts,
        esdoc: true,
      })
      .then(() => {
        assert.file(['config/esdoc.config.js']);
        assert.fileContent('package.json', 'build:docs');
        assert.fileContent('package.json', 'esdoc');
        assert.fileContent('package.json', 'esdoc-standard-plugin');
        assert.fileContent('contributing.md', 'yarn build:docs');
      });
  });

  test('no esdoc', () => {
    return runAppGenerator()
      .withPrompts({
        ...requiredPrompts,
        esdoc: false,
      })
      .then(() => {
        assert.noFile(['config/esdoc.config.js']);
        assert.noFileContent('package.json', 'build:docs');
        assert.noFileContent('package.json', 'esdoc');
        assert.noFileContent('package.json', 'esdoc-standard-plugin');
        assert.noFileContent('contributing.md', 'yarn build:docs');
      });
  });

  test('githubTemplates', () => {
    return runAppGenerator()
      .withPrompts({
        ...requiredPrompts,
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
        ...requiredPrompts,
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
          ...requiredPrompts,
          travisCI: true,
        })
        .then(() => {
          assert.file(['.travis.yml']);
        });
    });

    test('no travisCI', () => {
      return runAppGenerator()
        .withPrompts({
          ...requiredPrompts,
          travisCI: false,
        })
        .then(() => {
          assert.noFile(['.travis.yml']);
        });
    });

    test('esdoc', () => {
      return runAppGenerator()
        .withPrompts({
          ...requiredPrompts,
          travisCI: true,
          esdoc: true,
        })
        .then(() => {
          assert.fileContent('.travis.yml', 'provider: pages');
        });
    });

    test('esdoc', () => {
      return runAppGenerator()
        .withPrompts({
          ...requiredPrompts,
          travisCI: true,
          esdoc: false,
        })
        .then(() => {
          assert.noFileContent('.travis.yml', 'provider: pages');
        });
    });

    test('coveralls', () => {
      return runAppGenerator()
        .withPrompts({
          ...requiredPrompts,
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
          ...requiredPrompts,
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
          ...requiredPrompts,
          travisCI: true,
          npmDeploy: true,
          semanticRelease: false,
          npmUsername: 'some-username',
          npmPassword: 'some-password',
        })
        .then(() => {
          assert.noFile(['config/commitlint.config.js']);

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
          ...requiredPrompts,
          travisCI: true,
          npmDeploy: false,
        })
        .then(() => {
          assert.noFile(['config/commitlint.config.js']);
          assert.noFileContent('.travis.yml', 'deploy');
        });
    });

    test('npmDeploy with semanticRelease', () => {
      return runAppGenerator()
        .withPrompts({
          ...requiredPrompts,
          travisCI: true,
          npmDeploy: true,
          semanticRelease: true,
          npmUsername: 'some-username',
          npmPassword: 'some-password',
          githubUsername: 'some-username',
          githubPassword: 'some-password',
        })
        .then(() => {
          assert.file(['config/commitlint.config.js']);

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

    test('npmDeploy with semanticRelease and w/o createGithubRepository', () => {
      return runAppGenerator()
        .withPrompts({
          ...requiredPrompts,
          createGithubRepository: false,
          travisCI: true,
          npmDeploy: true,
          semanticRelease: true,
          npmUsername: 'some-username',
          npmPassword: 'some-password',
          githubUsername: 'some-username',
          githubPassword: 'some-password',
        })
        .then(() => {
          assert.file(['config/commitlint.config.js']);

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
