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

//db.GetConnection(function(conn) {
//	connection = conn;
//	console.log("Connection");
//	console.log(connection);
//});

/* ********************
 * Handle get requests for /
******************** */
server.get('/', function(request, response) {
	routes.RouteHandler('/');
	renderer.RenderHomePage(request, response);
});

/* ********************
 * Handle get requests for /login
******************** */
server.get('/login', function(request, response) {
	var authorization = auth.CheckAuth(request);
	if (authorization) {
		response.redirect('/');
		return;
	}
	renderer.RenderLoginPage(request, response);
});

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
 * Handle get requests for /register
******************** */
server.get('/register', function(request, response, next) {
	renderer.RenderRegisterPage(request, response);
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
 * Handle get requests for /buildings
******************** */
server.get('/buildings', function(request, response, next) {
	console.log("Rendering buildings page");
	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	getBuildingsData(function(titles, buildingsData) {
		var cbData = {};
		var managerData = {}

		renderer.RenderContentPage("buildings", titles, buildingsData, request, response);
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
 * Handle get requests for /locations
******************** */
server.get('/locations', function(request, response, next) {
	console.log("Rendering locations page");
	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	getLocationsData(function(titles, locationsData) {
		renderer.RenderContentPage("locations", titles, locationsData, request, response);
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
 * Handle get requests for /tools
******************** */
server.get('/tools', function(request, response, next) {
	console.log("Rendering tools page");
	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	getToolsData(function(titles, toolsData) {
		renderer.RenderContentPage("tools", titles, toolsData, request, response);
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
 * Handle get requests for /contains
 ******************** */
server.get('/contains', function(request, response, next) {
	console.log("Rendering contains page");
	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	getContainsData(function(titles, containsData) {
		renderer.RenderContentPage("contains", titles, containsData, request, response);
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
 * Handle get requests for /maintainers
******************** */
server.get('/maintainers', function(request, response, next) {
	console.log("Rendering maintainers page");
	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	getMaintainerData(function(titles, maintainersData) {
		renderer.RenderContentPage("maintainers", titles, maintainersData, request, response);
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
 * Handle get requests for /logout
******************** */
server.get('/logout', function(request, response, next) {
	console.log("Rendering logout page");
	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	// Remove the cookie
	response.clearCookie('site_auth');
	response.redirect('/');
});

/* ********************
 * Handle get requests for 
******************** */
server.get('/locations_and_tools', function(request, response, next) {
	console.log("Rendering locations_and_tools page");
	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	getLocationsAndToolsData(function(accordionData) {
		renderer.RenderAccordionPage("locations_and_tools", accordionData, request, response);
	});
});

/* ********************
 * Handle get requests for 
******************** */
server.get('/buildings_and_locations', function(request, response, next) {
	console.log("Rendering buildings_and_locations page");
	var authorization = auth.CheckAuth(request);
	if (!authorization) {
		response.redirect('/login');
		return;
	}
	getBuildingsAndLocationsData(function(accordionData) {
		renderer.RenderAccordionPage("buildings_and_locations", accordionData, request, response);
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

/* ********************
 * Handle any other requests with the 404 page
******************** */
server.get('*', function(request, response) {
	renderer.Render404Page(request, response);
});

/* ********************
 * Query the DB to get the
******************** */
function getLocationsAndToolsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT `Location`.`ID`, `Location`.`name` AS lname, `Tool`.`TID`, `Tool`.`name` FROM Location, Tool, Contains, (SELECT Location.ID FROM Location WHERE 1) AS lids WHERE `lids`.`ID` = `Location`.`ID` AND `lids`.`ID` = `Contains`.`ID` AND `Contains`.`TID` = `Tool`.`TID`');

	// Execute the select statement
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutContentLocationsAndTools(results, function(parsedContent) {
			// Callback to return the data
			content(parsedContent);
		});
	});
}

/* ********************
 * Query the DB to get the
******************** */
function getBuildingsAndLocationsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT `Building`.`address`, `Building`.`name`, `Location`.`ID`, `Location`.`name` AS lname FROM Building, Location WHERE `Location`.`address` = `Building`.`address`');

	// Execute the select statement
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutContentBuildingsAndLocations(results, function(parsedContent) {
			// Callback to return the data
			content(parsedContent);
		});
	});
}

/* ********************
 * Query the DB to get the contains table data and construct the response JSO for handlebars
 ******************** */
function getContainsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT * FROM Contains WHERE 1');

	// Execute the select statement
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutTitlesAndContent(results, function(titles, parsedContent) {
			// Callback to return the data
			content(titles, parsedContent);
		});
	});
}

/* ********************
 * Query the DB to get the buildings table data and construct the response JSO for handlebars
******************** */
function getBuildingsData(content) {
	// Generate the select statement
	var query = sql.format('SELECT * FROM Building WHERE 1');

	// Execute the select statement
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutTitlesAndContent(results, function(titles, parsedContent) {
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
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutTitlesAndContent(results, function(titles, parsedContent) {
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
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutTitlesAndContent(results, function(titles, parsedContent) {
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
	db.Query(query, function(status, results) {
		// Pass the error back if present
		if (!status) {
			console.log("ERROR: " + results);
			return;
		}
		dbParser.ParseOutTitlesAndContent(results, function(titles, parsedContent) {
			// Callback to return the data
			content(titles, parsedContent);
		});
	});
}
