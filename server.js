var fs = require('fs');
var http = require('http');
var path = require('path');
var util = require('util');

var exphbs = require('express-handlebars');
var express = require('express');
var hbs = require('handlebars');
var sql = require('mysql');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var server = express();

var port = process.env.PORT || 3000;

const saltRounds = 10;

server.engine('handlebars', exphbs({defaultLayout: 'main'}));
server.set('view engine', 'handlebars');

server.use(express.static(path.join(__dirname, 'public')));

server.use(express.urlencoded({extended: true}));
server.use(express.json());
server.use(cookieParser());

server.use(session({
	key: 'site_auth',
	secret: 'somerandonstuffs',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000
	}
}));

var connection;

function handleDisconnect() {
	console.log('1. connecting to db:');
	connection = sql.createConnection('mysql://cs340_bartonad:potato@classmysql.engr.oregonstate.edu/cs340_bartonad');

	connection.connect(function(err) {
		if (err) {
			console.log('2. error when connecting to db:', err);
			setTimeout(handleDisconnect, 1000);
		}
		console.log("Connected!");
	});
	connection.on('error', function(err) {
		console.log('3. db error', err);
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleDisconnect();
		} else {
			throw err;
		}
	});
}

handleDisconnect();

hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
	switch (operator) {
		case '==':
			return (v1 == v2) ? options.fn(this) : options.inverse(this);
		case '===':
			return (v1 === v2) ? options.fn(this) : options.inverse(this);
		case '!=':
			return (v1 != v2) ? options.fn(this) : options.inverse(this);
		case '!==':
			return (v1 !== v2) ? options.fn(this) : options.inverse(this);
		case '<':
			return (v1 < v2) ? options.fn(this) : options.inverse(this);
		case '<=':
			return (v1 <= v2) ? options.fn(this) : options.inverse(this);
		case '>':
			return (v1 > v2) ? options.fn(this) : options.inverse(this);
		case '>=':
			return (v1 >= v2) ? options.fn(this) : options.inverse(this);
		case '&&':
			return (v1 && v2) ? options.fn(this) : options.inverse(this);
		case '||':
			return (v1 || v2) ? options.fn(this) : options.inverse(this);
		default:
			return options.inverse(this);
	}
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
	if (req.cookies.site_auth) {
		res.redirect('/');
	} else {
		next();
	}    
};


//server.use((req, res, next) => {
//	if (req.cookies.site_auth) {
//		res.clearCookie('site_auth');        
//	}
//	next();
//});

function renderHome(request, response, log_in_status) {
	var templateArgs = {
		title: "Tools DB",
		nav_title: "Tools DB",
		active: "home",
		loggedIn: log_in_status,
		loadCss: [
			{filename: "index.css"},
			{filename: "home.css"},
		],
		loadJs: [
			{filename: "index.js"},
		],
	};
	response.render('homePage', templateArgs);
};

function renderTable(request, response) {
	var templateArgs = {
		title: "Tools DB",
		nav_title: "Tools DB",
		active: "buildings",
		loadCss: [
			{filename: "index.css"},
			{filename: "building.css"},
		],
		loadJs: [
			{filename: "index.js"},
		],
		header: [
			{title: "title1"},
			{title: "title2"},
		],
		item: [
			{content: 1, second: 2},
			{content: 2, second: 2},
			{content: 3, second: 2},
			{content: 4, second: 2},
		],
	};
	response.render('contentPage', templateArgs);
};

// 
server.get('/', (request, response) => {
	if (request.cookies.site_auth) {
		renderHome(request, response, true);
	} else {
		renderHome(request, response, false);
	}
});

server.get('/login', function(request, response) {
	var templateArgs = {
		title: "Title",
		nav_title: "Tools DB",
		active: "login",
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
server.post('/login', function(request, response) {
	console.log("Username: " + request.body.username);

	// Do some database stuff
	var query = sql.format('SELECT password FROM User WHERE email = ?', [request.body.username]);
	console.log("QUERY: " + query);
	connection.query(query, function (error, results, fields) {
		if (error) {
			console.log("ERROR: " + error);
			return;
		}
		console.log('The results: ', results);
		console.log("PASS?: " + results[0].password);
		bcrypt.compare(request.body.password, results[0].password, function(err, res) {
			// If they are authorized, set a cookie
			if (res == true) {
				console.log("IT IS TRUE");
				// Now figure out what value to use for the cookie
				var cookieName = "site_auth";
				var toHash = request.body.username + request.body.password;
				bcrypt.hash(toHash, saltRounds, function(err, hash) {
					var cookieValue = hash;
					response.cookie(cookieName, "somerandonstuffs", { maxAge: 900000, httpOnly: true });
					// TODO fix this, redirecting isnt working
					//response.redirect('/');
					response.write('hi');
				});
			}
		});
	});
});


server.get('/register', function(request, response, next) {
	var templateArgs = {
		title: "Title",
		nav_title: "Tools DB",
		active: "register",
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
server.post('/register', function(request, response) {
	console.log("Request username: " + request.body.username);
	console.log("Request password: " + request.body.password);
	// Do some database stuff

	var password = request.body.password;
	var pass_hash;

	bcrypt.hash(password, saltRounds, function(err, hash) {
		// Store hash in your password DB.
		console.log("HASH: " + hash);
		pass_hash = hash;

		var post  = {email: request.body.username, password: pass_hash};
		var query = sql.format('INSERT INTO User SET ?', post);
		connection.query(query, function (error, results, fields) {
			if (error) {
				console.log("ERROR: " + error);
				return;
			}
			console.log('The results: ', results);
			// Neat!
			response.write('hi');
		});
	});
});

server.get('/buildings', function(request, response, next) {
	renderTable(request, response);
});

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
}

server.get('/public/*', function(request, response, next) {
	serveStaticFiles(request, response);
});

server.get('/assets/*', function(request, response, next) {
	serveStaticFiles(request, response);
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
