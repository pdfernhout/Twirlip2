var http = require('http');

var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("ThunderbirdS Are Grow!\n");
});

server.listen(9000, "127.0.0.1");

console.log("Server running at http://127.0.0.1:9000/");