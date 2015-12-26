// Test at: http://localhost:9000
/* jslint node: true */
"use strict";

var testDelay_ms = 0;
// var testDelay_ms = 1000;

// Standard nodejs modules

var fs = require('fs');
var http = require('http');
var https = require('https');
var util = require('util');

// The modules below require npm installation
var express = require('express');
var bodyParser = require('body-parser');

// Support
var proxyRequest = require('./proxyRequest');
var storeRequest = require('./storeRequest');

// Main code

function applicationLog() {
    var newArguments = [new Date().toISOString()].concat(Array.prototype.slice.call(arguments));
    console.log.apply(console, newArguments);
}

applicationLog("================== Twirlip server for Node.js started ================");

applicationLog("__dirname", __dirname);

var app = express();

var logger = function(request, response, next) {
    applicationLog("Request:", request.method, request.url);
    next();
};

app.use(logger);

// TODO: Could there be an issue with bodyParser with undeleted temp files? (Mentioned somewhere online)
// includes support to parse JSON-encoded bodies (and saving the rawBody)
app.use(bodyParser.json({
    limit: '10mb'
}));

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

// Application routes

// Add a delay in handling for each request for testing if specified
if (testDelay_ms) {
	app.use(function(request, response, next){
		setTimeout(next, testDelay_ms);
	});
}

app.post("/api/proxy", function (request, response) {
    proxyRequest(request, response);
});

app.post("/api/store", function (request, response) {
	// TODO: Temporary one second delay for testing
	// setTimeout(storeRequest.bind(this, request, response), 1000);
    storeRequest(request, response);
});

app.use("/$", function(req, res) {
    res.redirect('/twirlip.html');
});

app.use("/", express.static(__dirname + "/../webapp"));

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

/*
app.use("/", function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("ThunderbirdS Are Grow!\n");
});
*/

var server = http.createServer(app);

server.listen(9000, "127.0.0.1", function () {
    var host = server.address().address;
    var port = server.address().port;
    applicationLog(util.format("Twirlip server listening at http://%s:%s", host, port));
});

console.log("Twirlip server running at http://127.0.0.1:9000/");