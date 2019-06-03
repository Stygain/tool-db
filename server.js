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

/* ********************
 * Server config
******************** */
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

server.listen(port, function() {
	console.log("Server running on port ", port);
});

/* ********************
 * END Server config
******************** */


var connection;

/* ********************
 * Database continual-connection
******************** */
function handleDisconnect() {
	console.log('1. connecting to db:');
	// CONFIG CHANGE USERNAME AND PASSWORD
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

// Star the database connection
handleDisconnect();

/* ********************
 * Handlebars conditional helper
******************** */
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

/* ********************
 * Check if the user is authenticated
******************** */
function checkAuth(request) {
	if (request.cookies.site_auth) {
		return true;
	}
	return false;
}

/* ********************
 * Check if the user is authenticated and redirect them elsewhere if not
******************** */
var sessionChecker = (req, res, next) => {
	if (req.cookies.site_auth) {
		res.redirect('/');
	} else {
		next();
	}    
};

/* ********************
 * Render the home page
******************** */
function renderHome(request, response) {
	var authorization = checkAuth(request);
	var templateArgs = {
		title: "Tools DB",
		nav_title: "Tools DB",
		active: "home",
		loggedIn: authorization,
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

/* ********************
 * Render any content page
******************** */
function renderContentPage(page, titles, data, request, response) {
	var authorization = checkAuth(request);
	if (page == "buildings") {
		var templateArgs = {
			title: "Tools DB",
			nav_title: "Tools DB",
			loggedIn: authorization,
			active: "buildings",
			loadCss: [
				{filename: "index.css"},
				{filename: "building.css"},
				{filename: "modal.css"},
			],
			loadJs: [
				{filename: "index.js"},
				{filename: "modal.js"},
			],
			header: titles,
			item: data,
			modalHeader: "Add New Building",
			modalType: "buildings",
			modalContentRow: [
				{
					inputType: "text",
					placeholder: "Address",
					name: "address",
					required: true,
				},
				{
					inputType: "text",
					placeholder: "Name",
					name: "name",
					required: true,
				},
				{
					inputType: "text",
					placeholder: "Manager",
					name: "manager",
					required: true,
				},
			],
		};
		console.log("TemplateArgs: " + templateArgs);
		response.render('contentPage', templateArgs);
	} else if (page == "locations") {
		var templateArgs = {
			title: "Tools DB",
			nav_title: "Tools DB",
			loggedIn: authorization,
			active: "locations",
			loadCss: [
				{filename: "index.css"},
				{filename: "building.css"},
				{filename: "modal.css"},
			],
			loadJs: [
				{filename: "index.js"},
				{filename: "modal.js"},
			],
			header: titles,
			item: data,
			modalHeader: "Add New Location",
			modalType: "locations",
			modalContentRow: [
				{
					inputType: "text",
					placeholder: "Address",
					name: "address",
					required: true,
				},
				{
					inputType: "text",
					placeholder: "Name",
					name: "name",
					required: true,
				},
				{
					inputType: "text",
					placeholder: "Manager",
					name: "manager",
					required: true,
				},
			],
		};
		console.log("TemplateArgs: " + templateArgs);
		response.render('contentPage', templateArgs);
	} else if (page == "tools") {
		var templateArgs = {
			title: "Tools DB",
			nav_title: "Tools DB",
			loggedIn: authorization,
			active: "tools",
			loadCss: [
				{filename: "index.css"},
				{filename: "building.css"},
				{filename: "modal.css"},
			],
			loadJs: [
				{filename: "index.js"},
				{filename: "modal.js"},
			],
			header: titles,
			item: data,
			modalHeader: "Add New Tool",
			modalType: "tools",
			modalContentRow: [
				{
					inputType: "text",
					placeholder: "Address",
					name: "address",
					required: true,
				},
				{
					inputType: "text",
					placeholder: "Name",
					name: "name",
					required: true,
				},
				{
					inputType: "text",
					placeholder: "Manager",
					name: "manager",
					required: true,
				},
			],
		};
		console.log("TemplateArgs: " + templateArgs);
		response.render('contentPage', templateArgs);
	} else if (page == "maintainers") {
		var templateArgs = {
			title: "Tools DB",
			nav_title: "Tools DB",
			loggedIn: authorization,
			active: "maintainers",
			loadCss: [
				{filename: "index.css"},
				{filename: "building.css"},
				{filename: "modal.css"},
			],
			loadJs: [
				{filename: "index.js"},
				{filename: "modal.js"},
			],
			header: titles,
			item: data,
			modalHeader: "Add New Maintenance Company",
			modalType: "maintainers",
			modalContentRow: [
				{
					inputType: "text",
					placeholder: "Address",
					name: "address",
					required: true,
				},
				{
					inputType: "text",
					placeholder: "Name",
					name: "name",
					required: true,
				},
				{
					inputType: "text",
					placeholder: "Manager",
					name: "manager",
					required: true,
				},
			],
		};
		console.log("TemplateArgs: " + templateArgs);
		response.render('contentPage', templateArgs);
	}
};

/* ********************
 * Handle get requests for /
******************** */
server.get('/', (request, response) => {
	renderHome(request, response);
});

/* ********************
 * Handle get requests for /login
******************** */
server.get('/login', function(request, response) {
	var authorization = checkAuth(request);
	if (authorization) {
		response.redirect('/');
		return;
	}
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

/* ********************
 * Handle post requests for /login
******************** */
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
					response.status(200).end();
					//response.redirect('/');
				});
			} else {
			    response.status(401).end();
			}
		});
	});
});


/* ********************
 * Handle get requests for /register
******************** */
server.get('/register', function(request, response, next) {
	var authorization = checkAuth(request);
	if (authorization) {
		response.redirect('/');
		return;
	}
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

/* ********************
 * Handle post requests for /register
******************** */
server.post('/register', function(request, response) {
	console.log("Request username: " + request.body.username);
	console.log("Request password: " + request.body.password);

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
				console.log("SENDING 401");
				response.status(401).end();
				//return;
			} else {
			    console.log('The results: ', results);
			    // Neat!
			    // TODO fix this, redirecting isnt working
			    response.status(200).end();
			    //response.redirect('/');
			}
		});
	});
});

/* ********************
 * Handle get requests for /buildings
******************** */
server.get('/buildings', function(request, response, next) {
	getBuildingsData(function(titles, buildingsData) {
		console.log("Titles: " + titles);
		console.log("Buildings data: " + buildingsData);
		renderContentPage("buildings", titles, buildingsData, request, response);
	});
});

/* ********************
 * Handle get requests for /locations
******************** */
server.get('/locations', function(request, response, next) {
	getLocationsData(function(titles, locationsData) {
		console.log("Titles: " + titles);
		console.log("Locations data: " + locationsData);
		renderContentPage("locations", titles, locationsData, request, response);
	});
});

/* ********************
 * Handle get requests for /tools
******************** */
server.get('/tools', function(request, response, next) {
	getToolsData(function(titles, toolsData) {
		console.log("Titles: " + titles);
		console.log("Tools data: " + toolsData);
		renderContentPage("tools", titles, toolsData, request, response);
	});
});

/* ********************
 * Handle get requests for /maintainers
******************** */
server.get('/maintainers', function(request, response, next) {
	getMaintainerData(function(titles, maintainersData) {
		console.log("Titles: " + titles);
		console.log("Maintainers data: " + maintainersData);
		renderContentPage("maintainers", titles, maintainersData, request, response);
	});
});

/* ********************
 * Handle get requests for /logout
******************** */
server.get('/logout', function(request, response, next) {
	// Remove the cookie
	response.clearCookie('site_auth');
	response.redirect('/');
});

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
 * Handle any other requests with the 404 page
******************** */
server.get('*', function(request, response) {
	response.render('404Page');
});

/* ********************
 * Query the DB to get the buildings table data and construct the response JSO for handlebars
******************** */
function getBuildingsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT * FROM Building WHERE 1');

	// Execute the select statement
	connection.query(query, function (error, results, fields) {
		// Pass the error back if present
		if (error) {
			console.log("ERROR: " + error);
			return;
		}
		parseOutTitlesAndContent(results, function(titles, parsedContent) {
			// Callback to return the data
			content(titles, parsedContent);
		});
	});
}

/* ********************
 * Query the DB to get the locations table data and construct the response JSO for handlebars
******************** */
function getLocationsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT * FROM Location WHERE 1');

	// Execute the select statement
	connection.query(query, function (error, results, fields) {
		// Pass the error back if present
		if (error) {
			console.log("ERROR: " + error);
			return;
		}
		parseOutTitlesAndContent(results, function(titles, parsedContent) {
			// Callback to return the data
			content(titles, parsedContent);
		});
	});
}

/* ********************
 * Query the DB to get the tools table data and construct the response JSO for handlebars
******************** */
function getToolsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT * FROM Tool WHERE 1');

	// Execute the select statement
	connection.query(query, function (error, results, fields) {
		// Pass the error back if present
		if (error) {
			console.log("ERROR: " + error);
			return;
		}
		parseOutTitlesAndContent(results, function(titles, parsedContent) {
			// Callback to return the data
			content(titles, parsedContent);
		});
	});
}

/* ********************
 * Query the DB to get the tools table data and construct the response JSO for handlebars
******************** */
function getMaintainerData(content) {
	// Generate the select statement
	var query = sql.format('SELECT * FROM `Maintenance Company` WHERE 1');

	// Execute the select statement
	connection.query(query, function (error, results, fields) {
		// Pass the error back if present
		if (error) {
			console.log("ERROR: " + error);
			return;
		}
		parseOutTitlesAndContent(results, function(titles, parsedContent) {
			// Callback to return the data
			content(titles, parsedContent);
		});
	});
}

function parseOutTitlesAndContent(results, content) {
	var title_arr = [];
	for (var key in Object.keys(results[0])) {
		var tmp_obj = {title: Object.keys(results[0])[key]};
		title_arr.push(tmp_obj);
	}
	//console.log("Title Array: ", title_arr);

	// Generate the content
	var content_arr = [];
	for (var index in results) {
		var tmp_arr = [];
		for (var jndex in results[index]) {
			var tmp_sub_obj = {content: results[index][jndex]};
			tmp_arr.push(tmp_sub_obj);
		}
		content_arr.push(tmp_arr);
	}
	//console.log("Content Array: ", content_arr);

	// Callback to return the data
	content(title_arr, content_arr);
}
