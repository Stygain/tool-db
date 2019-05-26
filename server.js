var express = require('express');
var server = express();
var fs = require('fs');
var http = require('http');
var path = require('path');
var exphbs = require('express-handlebars');
var hbs = require('handlebars');
var util = require('util');
var sql = require('mysql');
//var sql = require('mssql');
var bcrypt = require('bcrypt');

var port = process.env.PORT || 3000;

server.engine('handlebars', exphbs({defaultLayout: 'main'}));
server.set('view engine', 'handlebars');

server.use(express.static(path.join(__dirname, 'public')));

server.use(express.urlencoded({extended: true}));
server.use(express.json());

var connection = sql.createConnection({
	host: "classmysql.engr.oregonstate.edu",
	user: "cs340_bartonad",
	password: "potato",
	database: "cs340_bartonad",
});

connection.connect();

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
	  	{filename: "register.js"}
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

server.get('/:page/:index', function(request, response, next) {
  console.log("page request", request.params.page);
  console.log("index request", request.params.index);
});

server.get('*', function(request, response) {
  response.render('404Page');
});

server.post('/login', function(request, response) {
	console.log("Request: " + request.body.username);

	// Do some database stuff
	var query = sql.format('SELECT password FROM User WHERE email = ?', [request.body.username]);
	console.log(query);
	connection.query(query, function (error, results, fields) {
		if (error) throw error;
		console.log('The results: ', results);
		console.log("PASS?: " + results[0].password);
		bcrypt.compare(request.body.password, results[0].password, function(err, res) {
			// If they are authorized, set a cookie
			if (res == true) {
				console.log("IT IS TRUE");
				// Now figure out what value to use for the cookie
				response.cookie('cookiename', 'cookievalue', { maxAge: 900000, httpOnly: true });
				response.write('hi');
			}
		});
	});
});

server.post('/register', function(request, response) {
	console.log("Request username: " + request.body.username);
	console.log("Request password: " + request.body.password);
	// Do some database stuff

	const saltRounds = 10;
	var password = request.body.password;
	var pass_hash;

	bcrypt.hash(password, saltRounds, function(err, hash) {
		// Store hash in your password DB.
		console.log("HASH: " + hash);
		pass_hash = hash;

		var post  = {email: request.body.username, password: pass_hash};
		var query = connection.query('INSERT INTO User SET ?', post, function (error, results, fields) {
			if (error) throw error;
			// Neat!
		});
	});

	response.write('hi');
});

server.listen(port, function() {
  console.log("Server running on port ", port);
});
