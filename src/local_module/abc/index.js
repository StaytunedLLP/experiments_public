const _ = require('lodash');
const marked = require('marked');

function hello() {
  return "Hello from abc package!";
}

function processText(text) {
    const upper = _.upperCase(text)
    return marked.parse(upper);
}

module.exports = { hello, processText };