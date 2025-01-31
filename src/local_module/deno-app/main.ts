// import { createRequire } from "node:module";
// const require = createRequire(import.meta.url);

// // Provide the absolute path to your local `abc` package
// const { hello, processText } = require("../abc/index.js");


import * as p1 from "package1";
import * as p2  from "package2";

console.log( p1.hello());
console.log(p1.processText("test string to process"));

console.log(p2.hello());
console.log(p2.processText("test string to process"));
