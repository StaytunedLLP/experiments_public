const _ = require('lodash');
const marked = require('marked');
const uuid = require('uuid');
function hello() {
  return "Hello from abc package!" + uuid.v4();

}

function processText(text) {
    const upper = _.upperCase(text)
    return marked.parse(upper);
}

module.exports = { hello, processText };