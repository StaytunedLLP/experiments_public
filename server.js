const http = require("node:http");

// Server has a 5 seconds keep-alive timeout by default
http
    .createServer((req, res) => {
        res.write("hello\n");
        res.end();
    })
    .listen(3000);
