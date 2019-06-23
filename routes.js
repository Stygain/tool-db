// Configuration of all the server routes

var sql = require('mysql');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

var renderer = require('./handlebars/renderer.js');
var auth = require('./auth.js');
var db = require('./db/db.js');
var query = require('./db/queries.js');

const saltRounds = 10;

module.exports = {
	GET: getRouteHandler,
	POST: postRouteHandler,
};

var getConfig = {
	'^/login$': renderLogin,
	'^/register$': renderRegister,
	'^/buildings$': renderBuildings,
	'^/locations$': renderLocations,
	'^/tools$': renderTools,
	'^/maintainers$': renderMaintainers,
	'^/locations_and_tools$': renderLocationsAndTools,
	'^/buildings_and_locations$': renderBuildingsAndLocations,
	'^/logout$': handleLogout,
};

var postConfig = {
	'^/login$': postLogin,
	'^/register$': postRegister,
	'^/buildings$': postBuildings,
	'^/buildingDelete$': postBuildingDelete,
	'^/locations$': postLocations,
	'^/locationDelete$': postLocationDelete,
	'^/tools$': postTools,
	'^/toolDelete$': postToolDelete,
	'^/maintainers$': postMaintainers,
	'^/maintainerDelete$': postMaintainerDelete,
};

/* ********************
 * Handle get requests for /home
******************** */
function renderHome(request, response) {
	console.log("Render Home");

	renderer.RenderHomePage(request, response);
};

/* ********************
 * Handle get requests for /login
******************** */
function renderLogin(request, response) {
	console.log("Render Login");

	auth.CheckAuth(request, function(authorization) {
		if (authorization) {
			response.redirect('/');
			return;
		}
		renderer.RenderLoginPage(request, response);
	});
	
};

/* ********************
 * Handle get requests for /register
******************** */
function renderRegister(request, response) {
	console.log("Render Register");

	auth.CheckAuth(request, function(authorization) {
		if (authorization) {
			response.redirect('/');
			return;
		}
		renderer.RenderRegister(request, response);
	});
};

/* ********************
 * Handle get requests for /buildings
******************** */
function renderBuildings(request, response) {
	console.log("Rendering buildings page");

	auth.CheckAuth(request, function(authorization) {
		if (!authorization) {
			response.redirect('/login');
			return;
		}
		query.Buildings(request.session.user, function(titles, buildingsData) {
			var cbData = {};
			var managerData = {}

			renderer.RenderContentPage("buildings", titles, buildingsData, request, response);
		});
	});
};

/* ********************
 * Handle get requests for /locations
******************** */
function renderLocations(request, response) {
	console.log("Rendering locations page");

	auth.CheckAuth(request, function(authorization) {
		if (!authorization) {
			response.redirect('/login');
			return;
		}
		query.Locations(request.session.user, function(titles, locationsData) {
			renderer.RenderContentPage("locations", titles, locationsData, request, response);
		});
	});
};

/* ********************
 * Handle get requests for /tools
******************** */
function renderTools(request, response) {
	console.log("Rendering tools page");

	auth.CheckAuth(request, function(authorization) {
		if (!authorization) {
			response.redirect('/login');
			return;
		}
		query.Tools(request.session.user, function(titles, toolsData) {
			renderer.RenderContentPage("tools", titles, toolsData, request, response);
		});
	});
};

///* ********************
// * Handle get requests for /contains
// ******************** */
//function renderContains(request, response) {
//	console.log("Rendering contains page");
//
//	auth.CheckAuth(request, function(authorization) {
//		if (!authorization) {
//			response.redirect('/login');
//			return;
//		}
//		query.Contains(function(titles, containsData) {
//			renderer.RenderContentPage("contains", titles, containsData, request, response);
//		});
//	});
//};

/* ********************
 * Handle get requests for /maintainers
******************** */
function renderMaintainers(request, response) {
	console.log("Rendering maintainers page");

	auth.CheckAuth(request, function(authorization) {
		if (!authorization) {
			response.redirect('/login');
			return;
		}
		query.Maintainers(request.session.user, function(titles, maintainersData) {
			renderer.RenderContentPage("maintainers", titles, maintainersData, request, response);
		});
	});
};

/* ********************
 * Handle get requests for /logout
******************** */
function handleLogout(request, response) {
	console.log("Rendering logout page");

	auth.CheckAuth(request, function(authorization) {
		if (!authorization) {
			response.redirect('/login');
			return;
		}
		// Remove the cookie
		response.clearCookie('site_auth');
		response.clearCookie('auth');
		response.redirect('/');
	});
};

/* ********************
 * Handle get requests for 
******************** */
function renderLocationsAndTools(request, response) {
	console.log("Rendering locations_and_tools page");

	auth.CheckAuth(request, function(authorization) {
		if (!authorization) {
			response.redirect('/login');
			return;
		}
		query.LocationsAndTools(request.session.user, function(accordionData) {
			renderer.RenderAccordionPage("locations_and_tools", accordionData, request, response);
		});
	});
};

/* ********************
 * Handle get requests for 
******************** */
function renderBuildingsAndLocations(request, response) {
	console.log("Rendering buildings_and_locations page");

	auth.CheckAuth(request, function(authorization) {
		if (!authorization) {
			response.redirect('/login');
			return;
		}
		query.BuildingsAndLocations(request.session.user, function(accordionData) {
			renderer.RenderAccordionPage("buildings_and_locations", accordionData, request, response);
		});
	});
};

/* ********************
 * Handle get requests
******************** */
function getRouteHandler(route, request, response) {
	console.log("ROUTE: " + route);
	if (route == '/') {
		renderer.RenderHomePage(request, response);
		return;
	}
	for (var routeRegex in getConfig) {
		var regex = new RegExp(routeRegex, "g");
		var results = route.match(regex);
		if (route.match(regex) != null) {
			console.log("MATCHED: " + regex);
			getConfig[routeRegex](request, response);
			return;
		}
	}
	renderer.Render404Page(request, response);
};




function randU32Sync() {
	return crypto.randomBytes(4).readUInt32BE(0, true);
}


/* ********************
 * Handle post requests for /login
******************** */
function postLogin(request, response) {
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
				//var cookieName = "site_auth";
				var random = randU32Sync();
				var toHash = request.body.username + random;
				console.log("ToHash: " + toHash);
				bcrypt.hash(toHash, saltRounds, function(err, hash) {
					console.log("Hash before:");
					console.log(hash);
					var cookieValue = Buffer.from(hash).toString('base64');
					console.log("Setting cookie value to:");
					console.log(cookieValue);
					response.cookie("auth", cookieValue, { maxAge: 900000, httpOnly: true });
					request.session.rd = random;
					request.session.user = request.body.username;
					console.log("Set rd to: " + request.session.rd);
					response.status(200).end();
				});
			} else {
			    response.status(401).end();
			}
		});
	});
};

/* ********************
 * Handle post requests for /register
******************** */
function postRegister(request, response) {
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
};

/* ********************
 * Handle post requests for /buildings
******************** */
function postBuildings(request, response) {
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
};

/* ********************
 * Handle post requests for /buildingDelete
******************** */
function postBuildingDelete(request, response) {
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
};

/* ********************
 * Handle post requests for /locations
******************** */
function postLocations(request, response) {
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
};

/* ********************
 * Handle post requests for /locationDelete
******************** */
function postLocationDelete(request, response) {
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
};

/* ********************
 * Handle post requests for /tools
******************** */
function postTools(request, response) {
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
};

/* ********************
 * Handle post requests for /toolDelete
******************** */
function postToolDelete(request, response) {
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
};

///* ********************
// * Handle post requests for /contains
// ******************** */
//function postContains(request, response) {
//	console.log("Contains Data: ");
//	console.log(request.body);
//
//	var queryData = {ID: request.body.lid, TID: request.body.tid};
//	var query = sql.format('INSERT INTO Contains SET ?', queryData);
//	db.Query(query, function(status, results) {
//		if (!status) {
//			console.log("ERROR: " + results);
//			response.status(401).end();
//			return;
//		} else {
//			response.status(200).end();
//		}
//	});
//};

///* ********************
// * Handle post requests for /containsDelete
// ******************** */
//function postContainDelete(request, response) {
//	console.log("Contains Delete Data: ");
//	console.log(request.body);
//
//	var query = sql.format('DELETE FROM Contains WHERE TID = ? AND ID = ?', [request.body.TID, request.body.ID]);
//	db.Query(query, function(status, results) {
//		if (!status) {
//			console.log("ERROR: " + results);
//			response.status(401).end();
//			return;
//		} else {
//			response.status(200).end();
//		}
//	});
//};

/* ********************
 * Handle post requests for /maintainers
******************** */
function postMaintainers(request, response) {
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
};

/* ********************
 * Handle post requests for /maintainerDelete
******************** */
function postMaintainerDelete(request, response) {
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
};

/* ********************
 * Handle post requests
******************** */
function postRouteHandler(route, request, response) {
	console.log("ROUTE: " + route);
	for (var routeRegex in postConfig) {
		var regex = new RegExp(routeRegex, "g");
		var results = route.match(regex);
		if (route.match(regex) != null) {
			console.log("MATCHED: " + regex);
			postConfig[routeRegex](request, response);
			return;
		}
	}
};
