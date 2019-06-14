var fs = require('fs');
//var http = require('http');
var path = require('path');
//var util = require('util');

var exphbs = require('express-handlebars');
var express = require('express');
//var hbs = require('handlebars');
var sql = require('mysql');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
//var session = require('express-session');


var setup = require('./setup.js');
var renderer = require('./handlebars/renderer.js');
var db = require('./db/db.js');
var dbParser = require('./db/parser.js');
var auth = require('./auth.js');
var routes = require('./routes.js');

var server = express();

var port = process.env.PORT || 3000;

const saltRounds = 10;

/* ********************
 * Server config
******************** */
server.engine('handlebars', exphbs({defaultLayout: 'main'}));
server.set('view engine', 'handlebars');

server.use(express.static(path.join(__dirname, 'public')));

server.use(express.urlencoded({extended: true}));
server.use(express.json());
server.use(cookieParser());

auth.InitializeSession(server);

server.listen(port, function() {
	console.log("Server running on port ", port);
});

/* ********************
 * END Server config
******************** */

setup.Setup();

// Start the database connection
db.Connect();

/* ********************
 * Serve any sort of file the user requests
******************** */
function serveStaticFiles(request, response) {
	var filePath = '.' + request.url;
	var extname = ''
	extname = path.extname(filePath);
	var contentType = 'text/html';

	switch (extname) {
	  case '.js':
		  contentType = 'text/javascript';
		  break;
	  case '.css':
		  contentType = 'text/css';
		  break;
	  case '.json':
		  contentType = 'application/json';
		  break;
	  case '.png':
		  contentType = 'image/png';
		  break;      
	  case '.jpg':
		  contentType = 'image/jpg';
		  break;
	  case '.wav':
		  contentType = 'audio/wav';
		  break;
	}

	fs.readFile(filePath, function(error, content) {
		if (error) {
			if(error.code == 'ENOENT'){
				renderer.Render404Page(request, response);
			}
			else {
				responseponse.writeHead(500);
				responseponse.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
				responseponse.end(); 
			}
		}
		else {
			response.writeHead(200, { 'Content-Type': contentType });
			response.end(content, 'utf-8');
		}
	});
}

/* ********************
 * Handle get requests for /public/*
******************** */
server.get('/public/*', function(request, response, next) {
	serveStaticFiles(request, response);
});

/* ********************
 * Handle get requests for /assets/*
******************** */
server.get('/assets/*', function(request, response, next) {
	serveStaticFiles(request, response);
});

/* ********************
 * Handle all GET requests
******************** */
server.get('*', function(request, response) {
	routes.GET(request.url, request, response);
});

/* ********************
 * Handle all POST requests
******************** */
server.post('*', function(request, response) {
	routes.POST(request.url, request, response);
});
