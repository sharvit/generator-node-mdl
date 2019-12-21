module.exports = {
  source: './src',
  destination: './docs',
  excludes: ['__mocks__'],
  plugins: [
    {
      name: 'esdoc-standard-plugin',
      option: {
        lint: { enable: true },
        accessor: {
          access: ['public', 'protected'],
          autoPrivate: true,
        },
        undocumentIdentifier: { enable: false },
        unexportedIdentifier: { enable: false },
        typeInference: { enable: true },
        manual: {
          index: './readme.md',
          globalIndex: true,
          files: [<% if (githubTemplates) { %>
            './other/examples.md',
            './contributing.md',
            './other/code_of_conduct.md',
            './other/roadmap.md',<% } %>
          ],
        },
        test: {
          source: './src',
          interfaces: ['describe', 'it', 'context', 'suite', 'test'],
          includes: ['\\.test\\.js$'],
        },
      },
    },
    {
      name: 'esdoc-ecmascript-proposal-plugin',
      option: { all: true },
    },
  ],
};
