"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
 
var http = require("http");
var fs = require("fs");
var port = 3330;

var chess = fs.readFileSync("images/chess.jpg");
var fern = fs.readFileSync("images/fern.jpg");

function serveImage(filename, req, res) {
    fs.readFile("images/"+filename, (err, body) => {
	if(err) {
	    console.error(err);
	    res.statusCode = 500;
	    res.statusMessage = "Server Error: Async File Read";
	    res.end("Crash - Server Broke");
	    return;
	}
	res.setHeader("Content-Type", "image/jpeg");
	res.end(body);
    });
}

var server = http.createServer((req, res) => {
    switch(req.url) {
    case "/chess":
    case "/chess/":
    case "/chess.jpg":
    case "/chess.jpeg":
	res.end(chess);
	break;
    case "/fern/":
    case "/fern":
    case "/fern.jpg":
    case "/fern.jpeg":
	res.end(fern);
	break;
    default:
	res.statusCode = 404;
	res.statusMessage = "Not Found";
	res.end("You Done Goofed - I can't find this file!");
    }
});

server.listen(port, () => {
    console.log("Listening on Port "+port);
});

