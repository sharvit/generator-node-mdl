# <%= projectName %>

> <%= description %>

[![Package Version](https://img.shields.io/npm/v/<%= projectName %>.svg?style=flat-square)](https://www.npmjs.com/package/<%= projectName %>)
[![Downloads Status](https://img.shields.io/npm/dm/<%= projectName %>.svg?style=flat-square)](https://npm-stat.com/charts.html?package=<%= projectName %>&from=2016-04-01)
<% if (travisCI) { %>[![Build Status: Linux](https://img.shields.io/travis/<%= githubUsername %>/<%= projectName %>/master.svg?style=flat-square)](https://travis-ci.org/<%= githubUsername %>/<%= projectName %>)
<% } %><% if (coveralls) { %>[![Coverage Status](https://coveralls.io/repos/github/<%= githubUsername %>/<%= projectName %>/badge.svg?branch=master)](https://coveralls.io/github/<%= githubUsername %>/<%= projectName %>?branch=master)<% } %>

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

## Related

// TODO

## License

MIT &copy; [<%= name %>](<%= website %>)
