"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

var http = require("http");
var url = require("url");
var fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));

var port = 3330;

var chess = fs.readFileSync("images/chess.jpg");
var fern = fs.readFileSync("images/fern.jpg");
var stylesheet = fs.readFileSync("gallery.css");

function getImageNames(callback) {
    fs.readdir("images/",(err, files) => {
		if(err)
		{
	  	  callback(err, undefined);
		}
		else
		{
	  	  callback(undefined, files);
		}
    });
}

function getImageTags(files) {
    return files.map(function(filename) {
	return "<img src='"+filename+"' alt='"+filename+"'>";
    });
}

function buildGallery(imageNames) {
    var html = "<!doctype html>";
    html += "<head>";
    html += "<title>"+config.title+"</title>";
    html += "<link href='gallery.css' rel='stylesheet' type='text/css'>";
    html += "</head>";
    html += "<body>";
    html += "<h1>"+config.title+"</h1>";
    html += "<form action=''><input type='text' name='title'>";
    html += "<input type='submit' value='Change Gallery Title'>";
    html += "</form>";
    html += getImageTags(imageNames).join("");
    html += "<form action='' method='POST' enctype='multipart/form-data'>";
    html += "<input type='file' name='image'>";
    html += "<input type='submit' value='Upload Image'>";
    html += "</form>";
    html += "<h1>Hello.</h1>Time is "+Date.now();
    html += "</body>";
    return html;
}

function serveGallery(req, res) {
    getImageNames(function(err, imageNames) {
	if(err) {
	    console.error(err);
	    res.statusCode=500;
	    res.statusMessage= "Server broke :(";
	    res.end("Server broke :(");
	    return;
	}
	res.setHeader("Content-Type", "text/html");
	res.end(buildGallery(imageNames));
    });
}

function serveImage(filename, req, res) {
    fs.readFile("images"+filename, (err, body) => {
	if(err) {
	    console.error(err);
	    res.statusCode = 404;
	    res.statusMessage = "Resource Not Found";
	    res.end("Yall 404'd - ain't nothin' here");
	    return;
	}
	//console.log("User opened "+filename+" at "+Date.now());
	res.setHeader("Content-Type", "image/jpeg");
	res.end(body);
    });
}

function uploadPicture(req, res) {
	var body = "";
	req.on("error", () => {
		res.statusCode = 500;
		res.end();
	});
	req.on("data", (data) => {
		body += data;
	});
	req.on("end", () => {
		fs.writeFile("filename", body, (err) => {
			if(err){
				console.error(err);
				res.statusCode = 500;
				res.end();
				return;
			}
			serveGallery(req, res);
		});
	});
}

var server = http.createServer((req, res) => {
	//at most we will have two parts, split on query "?"
	var urlParts = url.parse(req.url);
	if(urlParts.query)
	{
		//queryString = decodeURIComponent(queryString);
		var matches = /title=(.+)($|&)/.exec(urlParts.query);
		if(matches && matches[1]){
			config.title = decodeURIComponent(matches[1]);
			fs.writeFile("config.json", JSON.stringify(config));
		}
	}
  //QUERY STRUCTURE
    switch(urlParts.pathname) {
      //CSS FILE
    case "/gallery.css":
	res.setHeader("Content-Type", "text/css");
	res.end(stylesheet);
	break;
  //ALL OTHER QUERIES
    case "/":
    case "/gallery":
    if(req.method == "GET"){
    	serveGallery(req, res);
    } else if(req.method == "POST"){
    	uploadPicture(req, res);
    }
	//serveGallery(req, res);
	break;
    default:
	serveImage(req.url, req, res);
    }
});

server.listen(port, () => {
    console.log("Listening on Port "+port);
    if(config)
    {
      console.log("Config File Loaded")
    }
    else{
      console.error("No Config File Loaded -- FATAL");
    }
});
