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
var stylesheet = fs.readFileSync("gallery.css");

var chessHtml = "<img src='/chess.jpg' alt='chess pieces'>";
var fernHtml = "<img src='/fern.jpg' alt='fern'>";
var aceHtml = "<img src='/ace.jpg' alt='a fishing ace at work'>";
var bubbleHtml = "<img src='/bubble.jpg' alt='a frozen bubble'>";
var mobileHtml = "<img src='/mobile.jpg' alt='a city on a mobile phone'>";

var imageNames = ["/chess.jpg", "/fern.jpg", "/ace.jpg", "/bubble.jpg", "/mobile.jpg"];

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
    case "/ace/":
    case "/ace":
    case "/ace.jpg":
    case "/ace.jpeg":
	serveImage("ace.jpg", req, res);
	break;
    case "/bubble/":
    case "/bubble":
    case "/bubble.jpg":
    case "/bubble.jpeg":
	serveImage("bubble.jpg", req, res);
	break;
    case "/mobile/":
    case "/mobile":
    case "/mobile.jpg":
    case "/mobile.jpeg":
	serveImage("mobile.jpg", req, res);
	break;
    case "/gallery.css":
	res.setHeader("Content-Type", "text/css");
	res.end(stylesheet);
	break;
    case "/gallery":
	var gHtml = imageNames.map(function(filename){
	    return "<img src = '"+filename+"' alt = 'gallery image'>";
	}).join("");
	var html = "<!doctype html>";
	html += "<head>"
	html += "<title>Gallery</title>"
	html += "<link href='gallery.css' rel='stylesheet' type='text/css'>";
	html += "</head>";
	html += "<body>";
	html += "<h1>Gallery</h1>";
	html += gHtml;
	html += "<h1>Hello.</h1>Time is "+Date.now();
	html += "</body>";
	res.setHeader("Content-Type", "text/html");
	res.end(html);
    default:
	res.statusCode = 404;
	res.statusMessage = "Not Found";
	res.end("You Done Goofed - I can't find this file!");
    }
});

server.listen(port, () => {
    console.log("Listening on Port "+port);
});

