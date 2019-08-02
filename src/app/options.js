const options = {
  projectName: {
    type: String,
    desc: 'Project name',
  },
  description: {
    type: String,
    desc: 'Project description',
  },
  name: { type: String, desc: "Author's name" },
  email: { type: String, desc: "Author's email" },
  website: { type: String, desc: "Author's website" },
  githubUsername: { type: String, desc: 'GitHub username' },
  githubTemplates: {
    type: Boolean,
    desc: 'Would you like to make it Github friendly for contributions?',
  },
  createGithubRepository: {
    type: Boolean,
    desc: 'Let me create a new github repository for you?',
  },
  coveralls: {
    type: Boolean,
    desc: 'Connect TravisCI to Coveralls?',
  },
  travisCI: {
    type: Boolean,
    desc: 'Give your project super prowers using Travis CI?',
  },
  npmDeploy: {
    type: Boolean,
    desc: 'Automatically deploy to npm using TravisCI?',
  },
  semanticRelease: {
    type: Boolean,
    desc: 'Use semantic-release?',
  },
  npmToken: {
    type: String,
    desc:
      'Your npm-token, needed when using with --npmDeploy (https://github.com/sharvit/generator-node-mdl#about-passwords-and-tokens)',
  },
  githubToken: {
    type: String,
    desc:
      'Your github-token, needed when using with --createGithubRepository or --semanticRelease (https://github.com/sharvit/generator-node-mdl#about-passwords-and-tokens)',
  },
  noDefaults: {
    type: Boolean,
    desc: 'Set all the default Boolean optins to false',
  },
};

export default options;
