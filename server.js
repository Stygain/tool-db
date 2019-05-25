var express = require('express');
var server = express();
var fs = require('fs');
var http = require('http');
var path = require('path');
var exphbs = require('express-handlebars');
var hbs = require('handlebars');
// var bootstrap = require('bootstrap');

var port = process.env.PORT || 3000;

server.engine('handlebars', exphbs({defaultLayout: 'main'}));
server.set('view engine', 'handlebars');

server.use(express.static(path.join(__dirname, 'public')));

server.get('/', function(request, response, next) {
  var templateArgs = {
	  title: "Title",
	  loadCss: [
	  	{filename: "index.css"},
	  ],
	  loadJs: [
	  	{filename: "index.js"},
	  ],
  };
  response.render('mainPage', templateArgs);
});

server.get('/login', function(request, response, next) {
  var templateArgs = {
	  title: "Title",
	  login: true,
	  loadCss: [
	  	{filename: "index.css"},
	  	{filename: "login.css"},
	  ],
	  loadJs: [
	  	{filename: "index.js"},
	  	{filename: "login.js"}
	  ],
  };
  response.render('loginPage', templateArgs);
});

server.get('/register', function(request, response, next) {
  var templateArgs = {
	  title: "Title",
	  login: false,
	  loadCss: [
	  	{filename: "index.css"},
	  	{filename: "login.css"},
	  ],
	  loadJs: [
	  	{filename: "index.js"},
	  	{filename: "login.js"}
	  ],
  };
  response.render('loginPage', templateArgs);
});

server.get('/public/*', function(request, response, next) {
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
			  response.render('404Page');
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
});

server.get('/assets/*', function(request, response, next) {
  var filePath = '.' + request.url;
  var extname = ''
  extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.jpg':
	  contentType = 'image/jpg';
	  break;
  }
  fs.readFile(filePath, function(error, content) {
	if (error) {
      response.render('404Page');
	} else {
      response.writeHead(200, { 'Content-Type': contentType });
	  response.end(content, 'utf-8');
	}
  });
});

server.get('/:page/:index', function(request, response, next) {
  console.log("page request", request.params.page);
  console.log("index request", request.params.index);
});

server.get('*', function(request, response) {
  response.render('404Page');
});

server.listen(port, function() {
  console.log("Server running on port ", port);
});
