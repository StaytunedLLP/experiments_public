// import { createRequire } from "node:module";
// const require = createRequire(import.meta.url);

// // Provide the absolute path to your local `abc` package
// const { hello, processText } = require("../abc/index.js");


import { hello, processText } from "abc"

console.log( hello());
console.log("Processing Text from abc:", processText("test string to process"));