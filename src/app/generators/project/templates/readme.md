# <%= projectName %>

> <%= description %>

[![Package Version](https://img.shields.io/npm/v/<%= projectName %>.svg?style=flat-square)](https://www.npmjs.com/package/<%= projectName %>)<% if (semanticRelease) { %>
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)<% } %>
[![Downloads Status](https://img.shields.io/npm/dm/<%= projectName %>.svg?style=flat-square)](https://npm-stat.com/charts.html?package=<%= projectName %>&from=2016-04-01)
<% if (travisCI) { %>[![Build Status: Linux](https://img.shields.io/travis/<%= githubUsername %>/<%= projectName %>/master.svg?style=flat-square)](https://travis-ci.org/<%= githubUsername %>/<%= projectName %>)<% } %>
<% if (coveralls) { %>[![Coverage Status](https://coveralls.io/repos/github/<%= githubUsername %>/<%= projectName %>/badge.svg?branch=master)](https://coveralls.io/github/<%= githubUsername %>/<%= projectName %>?branch=master)<% } %>
<% if (githubTemplates) { %>[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<% } %>
[![dependencies Status](https://david-dm.org/<%= githubUsername %>/<%= projectName %>/status.svg)](https://david-dm.org/<%= githubUsername %>/<%= projectName %>)
[![devDependencies Status](https://david-dm.org/<%= githubUsername %>/<%= projectName %>/dev-status.svg)](https://david-dm.org/<%= githubUsername %>/<%= projectName %>?type=dev)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![MIT License](https://img.shields.io/npm/l/stack-overflow-copy-paste.svg?style=flat-square)](http://opensource.org/licenses/MIT)

## Why

// TODO

## Installation

```sh
npm install --save <%= projectName %>
```

## Usage

```js
const <%= camelProject %> = require('<%= projectName %>');

<%= camelProject %>('some text');
//=> some text
```

## Usage

```js
import <%= camelProject %>, { isEven, isOdd } from '<%= projectName %>';

<%= camelProject %>('some text');
//=> some text

isEven(8);
//=> true
isEven(9);
//=> false
isOdd(8);
//=> false
isOdd(9);
//=> true
```

If you are not able to use `es-modules`, you can use `require` instead of `import`
```js
const { default: <%= camelProject %>, isEven, isOdd } = require('<%= projectName %>');
```

To use it directly inside a browser, load it via a script `tag`:
```html
<script type="text/javascript" src="./node_modules/<%= projectName %>/dist/index.js"></script>
<script type="text/javascript">
  const { default: <%= camelProject %>, isEven, isOdd } = window['<%= projectName %>'];
</script>
```

## Related

// TODO

## License

MIT &copy; [<%= name %>](<%= website %>)
