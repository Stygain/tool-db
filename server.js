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
 * Handle post requests for /login
******************** */
server.post('/login', function(request, response) {
	// Do some database stuff
	var query = sql.format('SELECT password FROM User WHERE email = ?', [request.body.username]);
	db.Query(query, function(status, results) {
		if (!status) {
			console.log("ERROR: " + results);
			response.status(401).end();
			return;
		}
		if (results.length == 0) {
			response.status(401).end();
			return;
		}
		bcrypt.compare(request.body.password, results[0].password, function(err, res) {
			// If they are authorized, set a cookie
			if (res == true) {
				// Now figure out what value to use for the cookie
				var cookieName = "site_auth";
				var toHash = request.body.username + request.body.password;
				bcrypt.hash(toHash, saltRounds, function(err, hash) {
					var cookieValue = hash;
					response.cookie(cookieName, "somerandonstuffs", { maxAge: 900000, httpOnly: true });
					response.status(200).end();
				});
			} else {
			    response.status(401).end();
			}
		});
	});
});

/* ********************
 * Handle post requests for /register
******************** */
server.post('/register', function(request, response) {
	if (request.body.password != request.body.reenterPassword) {
		console.log("User passwords did not match");
		response.status(401).end();
		return;
	}

	var password = request.body.password;
	var passHash;

	bcrypt.hash(password, saltRounds, function(err, hash) {
		// Store hash in your password DB.
		console.log("HASH: " + hash);
		passHash = hash;

		var post  = {email: request.body.username, password: passHash};
		var query = sql.format('INSERT INTO User SET ?', post);
		db.Query(query, function(status, results) {
			if (!status) {
				console.log("ERROR: " + results);
				response.status(401).end();
				return;
			} else {
			    response.status(200).end();
			}
		});
	});
});

/* ********************
 * Handle post requests for /buildings
******************** */
server.post('/buildings', function(request, response) {
	//console.log("Buildings Data: ");
	//console.log(request.body);
	//console.log(request.body.address);
	//console.log(request.body.name);
	//console.log(request.body.manager);

	var query = sql.format('INSERT INTO Building SET ?', request.body);
	db.Query(query, function(status, results) {
		if (!status) {
			console.log("ERROR: " + results);
			response.status(401).end();
			return;
		} else {
			response.status(200).end();
		}
	});
});

/* ********************
 * Handle post requests for /buildingDelete
******************** */
server.post('/buildingDelete', function(request, response) {
	//console.log("Building Delete Data: ");
	//console.log(request.body);

	var query = sql.format('DELETE FROM Building WHERE address = ?', request.body.address);
	db.Query(query, function(status, results) {
		if (!status) {
			console.log("ERROR: " + results);
			response.status(401).end();
			return;
		} else {
			response.status(200).end();
		}
	});
});

/* ********************
 * Handle post requests for /locations
******************** */
server.post('/locations', function(request, response) {
	//console.log("Locations Data: ");
	//console.log(request.body);

	var query = sql.format('INSERT INTO Location SET ?', request.body);
	db.Query(query, function(status, results) {
		if (!status) {
			console.log("ERROR: " + results);
			response.status(401).end();
			return;
		} else {
			response.status(200).end();
		}
	});
});

/* ********************
 * Handle post requests for /locationDelete
******************** */
server.post('/locationDelete', function(request, response) {
	//console.log("Location Delete Data: ");
	//console.log(request.body);

	var query = sql.format('DELETE FROM Location WHERE ID = ?', request.body.ID);
	db.Query(query, function(status, results) {
		if (!status) {
			console.log("ERROR: " + results);
			response.status(401).end();
			return;
		} else {
			response.status(200).end();
		}
	});
});

/* ********************
 * Handle post requests for /tools
******************** */
server.post('/tools', function(request, response) {
	//console.log("Tools Data: ");
	//console.log(request.body);

	var queryData = {TID: request.body.tid, name: request.body.name, "business name": request.body.maintainer};
	var query = sql.format('INSERT INTO Tool SET ?', queryData);
	db.Query(query, function(status, results) {
		if (!status) {
			console.log("ERROR: " + results);
			response.status(401).end();
			return;
		}
	});
	queryData = {ID: request.body.location, TID: request.body.tid};
	query = sql.format('INSERT INTO Contains SET ?', queryData);
	db.Query(query, function(status, results) {
		if (!status) {
			console.log("ERROR: " + results);
			response.status(401).end();
			return;
		} else {
			response.status(200).end();
		}
	});
});

/* ********************
 * Handle post requests for /toolDelete
******************** */
server.post('/toolDelete', function(request, response) {
	//console.log("Tool Delete Data: ");
	//console.log(request.body);

	var query = sql.format('DELETE FROM Tool WHERE TID = ?', request.body.TID);
	db.Query(query, function(status, results) {
		if (!status) {
			console.log("ERROR: " + results);
			response.status(401).end();
			return;
		} else {
			response.status(200).end();
		}
	});
});

/* ********************
 * Handle post requests for /contains
 ******************** */
server.post('/contains', function(request, response) {
	console.log("Contains Data: ");
	console.log(request.body);

	var queryData = {ID: request.body.lid, TID: request.body.tid};
	var query = sql.format('INSERT INTO Contains SET ?', queryData);
	db.Query(query, function(status, results) {
		if (!status) {
			console.log("ERROR: " + results);
			response.status(401).end();
			return;
		} else {
			response.status(200).end();
		}
	});
});

/* ********************
 * Handle post requests for /containsDelete
 ******************** */
server.post('/containsDelete', function(request, response) {
	console.log("Contains Delete Data: ");
	console.log(request.body);

	var query = sql.format('DELETE FROM Contains WHERE TID = ? AND ID = ?', [request.body.TID, request.body.ID]);
	db.Query(query, function(status, results) {
		if (!status) {
			console.log("ERROR: " + results);
			response.status(401).end();
			return;
		} else {
			response.status(200).end();
		}
	});
});

/* ********************
 * Handle post requests for /maintainers
******************** */
server.post('/maintainers', function(request, response) {
	//console.log("Maintainers Data: ");
	//console.log(request.body);

	var queryData = {name: request.body.name, phone: request.body.phone, email: request.body.email};
	var query = sql.format('INSERT INTO `Maintenance Company` SET ?', queryData);
	db.Query(query, function(status, results) {
		if (!status) {
			console.log("ERROR: " + results);
			response.status(401).end();
			return;
		} else {
			response.status(200).end();
		}
	});
});

/* ********************
 * Handle post requests for /maintainerDelete
******************** */
server.post('/maintainerDelete', function(request, response) {
	//console.log("Maintainer Delete Data: ");
	//console.log(request.body);

	var query = sql.format('DELETE FROM `Maintenance Company` WHERE name = ?', request.body.name);
	db.Query(query, function(status, results) {
		if (!status) {
			console.log("ERROR: " + results);
			response.status(401).end();
			return;
		} else {
			response.status(200).end();
		}
	});
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

server.get('*', function(request, response) {
	//console.log("REQUEST");
	//console.log(request);
	//console.log("DELIM");
	//console.log(request.url);

	routes.RouteHandler(request.url, request, response);
});

///* ********************
// * Handle any other requests with the 404 page
//******************** */
//server.get('*', function(request, response) {
//	renderer.Render404Page(request, response);
//});


