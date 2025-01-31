import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

// Provide the absolute path to your local `abc` package
const { hello, processText } = require("../abc/index.js");

console.log( hello());
console.log("Processing Text from abc:", processText("test string to process"));